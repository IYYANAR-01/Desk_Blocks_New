<script lang="ts">
    import { getContext } from "svelte";
    import { Text, Icon, Button } from "deskblocks";
    import { IconPlus } from "deskblocks/icons";
    import PanelList from "../PanelList/PanelList.svelte";
    import Dropbox from "../Dropbox/Dropbox.svelte";
    import { clickOutside } from './clickOutside.js'
    import { CONTEXT_NAME } from "../../constants";
    import "../../../common/common.css";
    import style from "./LeftPanel.module.css";

    let isPopupOpen = false;
    const toggleDropbox = () => {
        isPopupOpen = !isPopupOpen;
    };

    const context_data: any = getContext(CONTEXT_NAME);

    $: addedLayoutList = Object.keys($context_data.checkListData).filter((value) => value !== "default");
    $: dropboxList = Object.values($context_data.layoutList).filter((value:any) => {
        return !(addedLayoutList.includes(value.id))
    });

    const handleSelect = (e:any, id:string) => {
        if($context_data.isSaved) {
            $context_data.activeTemplate = id;
        } else {
            try {
                ZOHODESK.showpopup({
                    title : "Data loss",
                    content:"Please save your last entries and continue.",
                    type : "alert",
                    contentType : "html",
                    color : "red",
                    okText : "Ok"
                });
            } catch (error) {
                throw new Error("check the onDeleteTemplate method");
            }
        }
    }

    const handleAdd = (e: any, id: string) => {
        let obj = {
            [id]: [],
        };
        $context_data.checkListData = { ...obj, ...$context_data.checkListData };
        handleSelect({}, id);
        isPopupOpen = false;
    };

</script>

<div class={`${style.container} noShrink dflex flexDir cnt`}>
    <div class={`${style.default}`}>
        <PanelList 
            id="default"
            text="Default Template" 
            isActive={$context_data?.activeTemplate === "default"} 
            onClick={handleSelect}
        />
    </div>
    <div class={`${style.header} dflex alignCenter noShrink`}>
        <Text weight="medium" class={style.heading}>Layouts</Text>
    </div>
    <div class={style.addBtnWrapper} use:clickOutside on:outsideclick={() => {isPopupOpen = false}}>
        {#if dropboxList.length !== 0}
            <Button class="btn" on:click={toggleDropbox}>
                <Icon icon={IconPlus} size={20} />
                Add Layout
            </Button>
        {/if}

        {#if isPopupOpen}
            <Dropbox 
                position="leftTop" 
                options={dropboxList} 
                onClick={handleAdd} 
                clickOutside={clickOutside}
            />
        {/if}
    </div>

    <div class={`${style.content} flexible scrollY`}>
        {#each addedLayoutList as template}
            <PanelList
                onClick={handleSelect}
                id={template}
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
