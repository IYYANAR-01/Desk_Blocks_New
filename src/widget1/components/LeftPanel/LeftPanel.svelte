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

    const sharedData: any = getContext(CONTEXT_NAME);

    $: addedLayoutList = Object.keys($sharedData.checkListData).filter((value) => value !== "default");
    $: dropboxList = Object.values($sharedData.layoutList).filter((value:any) => {
        return !(addedLayoutList.includes(value.id))
    });

    const handleAdd = (e: any, id: string) => {
        let obj = {
            [id]: [],
        };

        sharedData.update((data: any) => {
            return { ...data, checkListData: { ...obj, ...$sharedData.checkListData } };
        });
    };

    const handleRemove = (e:any, id: string) => {
        sharedData.update((data: any) => {
            if(id === data.activeTemplate) {
                data.activeTemplate = 'default';
            }
            delete data.checkListData[id];
            return { ...data };
        });
    }

    const handleSelect = (e:any, id:string) => {
        sharedData.update((data: any) => {
            data.activeTemplate = id;
            return { ...data };
        });
    }
</script>

<div class={`${style.container} noShrink dflex flexDir cnt`}>
    <div class={`${style.default}`}>
        <PanelList 
            id="default"
            text="Default Template" 
            isActive={$sharedData?.activeTemplate === "default"} 
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
        {#each addedLayoutList as template (template)}
            <PanelList
                onDelete={handleRemove}
                onClick={handleSelect}
                id={template}
                text={$sharedData.layoutList[`${template}`].text}
                isActive={$sharedData.activeTemplate === $sharedData.layoutList[template].id}
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
