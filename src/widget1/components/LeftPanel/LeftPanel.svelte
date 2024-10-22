<script lang="ts">
    import { Text, Icon, Button } from "deskblocks";
    import { IconPlus } from "deskblocks/icons";
    import PanelList from "../PanelList/PanelList.svelte";
    import Dropbox from "../Dropbox/Dropbox.svelte";
    import "../../../common/common.css";
    import style from "./LeftPanel.module.css";
    import { onMount } from "svelte";
    import { initApp } from "../../../lib/util";

    let isPopupOpen = false;
    let layoutList:any[] = [];
    const toggleDropbox = () => {
        isPopupOpen = !isPopupOpen;
    };

    onMount(async () => {
        await initApp();
        const payload: RequestOptions = {
            url: `https://desk.zoho.com/api/v1/layouts?module=tickets`,
            headers: {},
            type: "GET",
            data: {},
            connectionLinkName: "checklist_app",
            responseType: "json",
        };

        ZOHODESK.request(payload)
            .then((res) => {
                let response = res.data.statusMessage.data || [];
                layoutList = response.map((data:any, index:number) => {
                    const { layoutName, id } = data;
                    return {
                        text: layoutName,
                        id
                    }
                });
                console.log(response, '...');
            })
            .catch((err) => console.log(err, '...err'));
    });
</script>

<div class={`${style.container} noShrink dflex flexDir cnt`}>
    <div class={`${style.default}`}>
        <PanelList text="Default Template" isActive />
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
            <Dropbox options={layoutList} position="leftTop"/>
        {/if}
    </div>
    <div class={`${style.content} flexible scrollY`}>
        <PanelList text="Desk 1" isActive/>
        <PanelList text="Desk 2"/>
    </div>
</div>

<style>
    .cnt :global(.btn) {
        height: 32px;
        width: 100%;
    }
</style>
