<script lang="ts">   
    import { getContext } from "svelte";
    import { Text, Spinner, Button } from "deskblocks";
    import Band from "../../../components/Band/Band.svelte";
    import List from "../../../components/List/List.svelte";
    import { CONTEXT_NAME } from "../../constants";
    import Textbox from "../../../components/Textbox/Textbox.svelte";
    import { setCheckList } from "../../../utils/utils";
    import '../../../common/common.css';
    import style from './ListWrapper.module.css';

    const context_data: any = getContext(CONTEXT_NAME);
    export let isMultiLayout = false;
    let value:string = '';
    let inputRef:any;
    let isEdited:boolean = false;
    let curEditId:string = "";
    let isSaving:boolean = false;

    let showInput = true;
    let template = $context_data.activeTemplate;
    let list =  $context_data.checkListData[$context_data.activeTemplate] ? [...$context_data.checkListData[$context_data.activeTemplate]].map((data)=>{ return {...data} }) : [];
    
    $:isCreated = $context_data.checkListData[$context_data.activeTemplate] ? true : false;
    
    $: {
        if(template !== $context_data.activeTemplate) {
            value = '';
            curEditId = '';
            if(inputRef) {
                inputRef.focus();
            }
            isEdited = false;
            template = $context_data.activeTemplate;
            list =  $context_data.checkListData[$context_data.activeTemplate] ? [...$context_data.checkListData[$context_data.activeTemplate]].map((data)=>{ return {...data} }) : [];
            if(isCreated) {
                showInput = true;
            } else {
                showInput = false
            }
        }
    }

    const handleEdit = async (editedValue:any, id:any) => {
        list[id].text = editedValue;
        curEditId = "";
        value = "";
    }

    const handleEnter = (e:any) => {
        if(e.key === "Enter") {
            value = value.trim();
            if(value !== '') {
                if(curEditId !== '') {
                    handleEdit(value, curEditId);
                } else {
                    list = [{ text: value }, ...list];
                    value = '';
                }
                isEdited = true;
                $context_data.isSaved = false;
            }
        }
    }

    const onDeleteTemplate = async (e:any) => {
        try {
            await ZOHODESK.showpopup({
                title : "Delete",
                content:"Are you sure, you want to delete this layout specified template",
                type : "confirmation",
                contentType : "html",
                color : "red",
                okText : "Delete",
                cancelText : "Cancel"
            });
            try {
                let contextData = {...$context_data.checkListData};
                delete contextData[template];
                await setCheckList(contextData);
                delete $context_data.checkListData[template];
                list = [];
                showInput = false;
                $context_data.isSaved = true; 
                $context_data = {...$context_data};
            } catch (error) {
                ZOHODESK.notify({
                    title : "Error",
                    content : `Something went wrong, data cannot be delete`,
                    icon:"success",
                    autoClose: false
                });
                throw new Error("check the onDeleteTemplate method");
            }
        } catch (error) {
            console.error(error);
        }
    }

    const onEdit = (e:any, id:number) => {
        curEditId = `${id}`;
        value = list[id].text;
        if (inputRef) {
            inputRef.focus();
        }
    }

    const onRemove = (e:any, id:number) => {
        list.splice(id, 1);
        list = [...list];
        isEdited = true;
        $context_data.isSaved = false;
    }

    const onCancel = () => {
        let newList = $context_data.checkListData[$context_data.activeTemplate] || [];
        list = [...newList];
        isEdited = false;
        $context_data.isSaved = true; 
    }

    const onSave = async () => {
        isSaving = true;
        try {
            if(list.length === 0) {
                ZOHODESK.showpopup({
                    title : "Cannot Save",
                    content:"Please add atleast one data.",
                    type : "alert",
                    contentType : "html",
                    color : "red",
                    okText : "Ok"
                });
            } else {
                let storedata = $context_data.checkListData;
                storedata[$context_data.activeTemplate] = [...list];
                await setCheckList(storedata);
                isEdited = false;
                ZOHODESK.notify({
                    title : "Success",
                    content : `Successfully added checklist data in "${template === 'default' ? template : $context_data.layoutList[template].text}" layout template`,
                    icon:"success",
                    autoClose: false
                });
                $context_data.isSaved = true; 
            }
        } catch (error) {
            ZOHODESK.notify({
                title : "Error",
                content : `Something went wrong, data cannot be saved`,
                icon:"success",
                autoClose: false
            });
            throw new Error("check the onSave method");
        } finally {
            isSaving = false;
        }
    }

</script> 

<div class={`flexible dflex flexDir`}>
    {#if isMultiLayout}
        <Band>
            <Text 
                slot="left" 
                weight="medium" 
                size="medium"
            >
                {$context_data.activeTemplate === 'default' ? 'Default Template' : `Layout - ${$context_data.layoutList[$context_data.activeTemplate].text}`}
            </Text>
            <div slot="right">
                {#if $context_data.activeTemplate !== 'default' && isCreated}
                    <Button 
                        variant="danger-secondary" 
                        on:click={onDeleteTemplate}
                    >
                        Delete Template
                    </Button>
                {/if}
            </div>
        </Band>
    {/if}
    {#if showInput}
        <div class={style.inputbox}>
            <Textbox
                handleKey={handleEnter}
                handleBlur={""}
                bind:value={value}
                bind:ref={inputRef}
            />
        </div>
    {/if}
    <div class={`${style.content} flexible scrollY`}>
        {#if !isCreated && !showInput} 
            <div class={`dflex cover alignBoth flexDir`}>
                <Text size='small' class={style.emptyText}>No checklist template added for this layout</Text>
                <Button variant="secondary" on:click={()=>{ showInput = true }}>Add Checklist Template</Button>
            </div>
        {:else}
            {#each list as data, index}
                <List
                    text={data.text}
                    needCheckbox={false}
                    id={index}
                    handleEdit={onEdit}
                    handleDelete={onRemove}
                    isEditable={curEditId === `${index}`}
                    needAction={curEditId === ""}
                />
            {/each}
        {/if}
    </div>
    {#if isEdited && curEditId === ""}
        <Band type="footer">
            <div slot="left">
                <Button variant="primary" on:click={onSave} disabled={isSaving}>
                    {#if isSaving}
                    <Spinner slot="left-icon" onbrand /> Loading 
                    {:else} 
                    Save
                    {/if}
                </Button>
                <Button variant="tertiary" on:click={onCancel}>Cancel</Button>
            </div>
        </Band>
    {/if}
</div>