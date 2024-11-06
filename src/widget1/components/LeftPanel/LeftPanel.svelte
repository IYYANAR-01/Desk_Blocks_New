<script lang="ts">
    import { getContext } from "svelte";
    import { Text, Icon, Button } from "deskblocks";
    import { IconPlus } from "deskblocks/icons";
    import PanelList from "../PanelList/PanelList.svelte";
    import Dropbox from "../Dropbox/Dropbox.svelte";
    import "../../../common/common.css";
    import style from "./LeftPanel.module.css";
    import { CONTEXT_NAME } from "../../constants";

    let isPopupOpen = false;
    const toggleDropbox = () => {
        isPopupOpen = !isPopupOpen;
    };

    const context_data: any = getContext(CONTEXT_NAME);

    $: addedLayoutList = Object.keys($context_data.checkListData).filter((value) => value !== "default");
    $: dropboxList = Object.values($context_data.layoutList).filter((value:any) => {
        return !(addedLayoutList.includes(value.id))
    });

    const handleAdd = (e: any, id: string) => {
        let obj = {
            [id]: [],
        };
        context_data.update((data: any) => {
            return { ...data, checkListData: { ...obj, ...$context_data.checkListData } };
        });
        isPopupOpen = false;
    };

    const handleSelect = (e:any, id:string) => {
        context_data.update((data: any) => {
            data.activeTemplate = id;
            return { ...data };
        });
    }

    console.log(addedLayoutList, $context_data.checkListData, '.....')
</script>

<div class={`${style.container} noShrink dflex flexDir cnt`}>
    <div class={`${style.default}`}>
        <PanelList 
            id="default"
            text="Default Template" 
            isActive={$context_data?.activeTemplate === "default"} 
            needDelete={false} 
            onClick={handleSelect}
        />
    </div>

    <div class={`${style.header} dflex alignCenter noShrink`}>
        <Text weight="medium" class={style.heading}>Layout Specified Templates</Text>
    </div>

    <div class={style.addBtnWrapper}>
        <Button class="btn" on:click={toggleDropbox}>
            <Icon icon={IconPlus} size={20} />
            Add Layout
        </Button>
        {#if isPopupOpen}
            <Dropbox 
                position="leftTop" 
                options={dropboxList} 
                onClick={handleAdd} 
            />
        {/if}
    </div>

    <div class={`${style.content} flexible scrollY`}>
        {#each addedLayoutList as template}
            <PanelList
                onClick={handleSelect}
                id={template}
                needDelete={false} 
                text={$context_data.layoutList[template].text}
                isActive={$context_data.activeTemplate === $context_data.layoutList[template].id}
            />
        {/each}
    </div>
</div>

<style>
    .cnt :global(.btn) {
        height: 32px;
        width: 100%;
    }
</style>
