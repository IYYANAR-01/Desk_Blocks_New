<script lang="ts">   
    import { getContext } from "svelte";
    import { Text, Icon, Button } from "deskblocks";
    import '../../../common/common.css';
    import style from './ListWrapper.module.css';
    import Band from "../../../components/Band/Band.svelte";
    import List from "../../../components/List/List.svelte";
    import { CONTEXT_NAME } from "../../constants";
    import Textbox from "../../../components/Textbox/Textbox.svelte";

    const context_data: any = getContext(CONTEXT_NAME);
    export let isEnterpriseEdition = false;
    let value:string = '';
    let inputRef:any;
    let isEdited:boolean = false;
    let curEditId:string = "";

    $: list = $context_data.checkListData[$context_data.activeTemplate] || [];
    console.log($context_data.checkListData[$context_data.activeTemplate], list, '...');

    const handleEdit = async (editedValue:any, id:string) => {
        list[id].text = editedValue;
        curEditId = "";
        value = "";
    }

    const handleEnter = (e:any) => {
        if(e.key === "Enter") {
            value = value.trim();
            console.log(curEditId, '...enter');
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

    const onDeleteTemplate = (e:any) => {
        context_data.update((data: any) => {
            delete data.checkListData[data.activeTemplate];
            data.activeTemplate = 'default';
            return { ...data };
        });
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
    }

</script> 

<div class={`${style.container} flexible dflex flexDir`}>
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
        {#each list as data, index}
            <List
                text={data.text}
                needCheckbox={false}
                id={index}
                handleEdit={onEdit}
                handleDelete={onRemove}
                isEditable={curEditId === index}
            />
        {/each}
    </div>
    {#if isEdited}
        <Band type="footer">
            <div slot="right">
                <Button variant="tertiary">Cancel</Button>
                <Button variant="primary">Save</Button>
            </div>
        </Band>
    {/if}
</div>