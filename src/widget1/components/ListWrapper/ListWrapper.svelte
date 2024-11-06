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
    export let isEnterpriseEdition = false;
    let value:string = '';
    let inputRef:any;
    let isEdited:boolean = false;
    let curEditId:string = "";
    let isSaving:boolean = false;

    let template = $context_data.activeTemplate;
    let list =  [...$context_data.checkListData[$context_data.activeTemplate]].map((data)=>{ return {...data} });

    $: {
        if(template !== $context_data.activeTemplate) {
            value = '';
            curEditId = '';
            inputRef.focus();
            isEdited = false;
            template = $context_data.activeTemplate;
            list =  [...$context_data.checkListData[$context_data.activeTemplate]].map((data)=>{ return {...data} });
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
            }
        }
    }

    const onDeleteTemplate = async (e:any) => {
        try {
            let contextData = {...$context_data.checkListData};
            delete contextData[template];
            let setdata = await setCheckList(contextData);
            console.log(setdata, '...set');
            delete $context_data.checkListData[template];
            $context_data.activeTemplate = 'default';
            $context_data = {...$context_data};
        } catch (error) {
            throw new Error("check the onDeleteTemplate method");
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
    }

    const onCancel = () => {
        let newList = $context_data.checkListData[$context_data.activeTemplate] || [];
        list = [...newList];
        isEdited = false;
    }

    const onSave = async () => {
        isSaving = true;
        try {
            let storedata = $context_data.checkListData;
            storedata[$context_data.activeTemplate] = [...list];
            let setdata = await setCheckList(storedata);
            console.log(setdata, '...set');
            isEdited = false;
        } catch (error) {
            throw new Error("check the onSave method");
        } finally {
            isSaving = false; 
        }
    }

</script> 

<div class={`flexible dflex flexDir`}>
    {#if isEnterpriseEdition}
        <Band>
            <Text 
                slot="left" 
                weight="medium" 
                size="medium"
            >
                {$context_data.activeTemplate === 'default' ? 'Default Template' : `Layout - ${$context_data.layoutList[$context_data.activeTemplate].text}`}
            </Text>
            <div slot="right">
                {#if $context_data.activeTemplate !== 'default'}
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
    <div class={style.inputbox}>
        <Textbox
            handleKey={handleEnter}
            handleBlur={""}
            bind:value={value}
            bind:ref={inputRef}
        />
    </div>
    <div class={`${style.content} flexible scrollY`}>
        {#if list.length === 0} 
            <div class={`dflex cover alignBoth`}>
                <Text weight='bold'>No CheckList Added</Text>
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
    {#if isEdited}
        <Band type="footer">
            <div slot="right">
                <Button variant="tertiary" on:click={onCancel}>Cancel</Button>
                <Button variant="primary" on:click={onSave}>
                    {#if isSaving}
                        <Spinner slot="left-icon" onbrand /> Loading 
                    {:else} 
                        Save
                    {/if}
                </Button>
            </div>
        </Band>
    {/if}
</div>