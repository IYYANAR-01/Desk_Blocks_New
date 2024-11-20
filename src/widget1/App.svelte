<script lang="ts">
    import { onMount, setContext } from "svelte";
    import { writable } from "svelte/store";
    import { Text } from "deskblocks";
    import Band from "../components/Band/Band.svelte";
    import LeftPanel from "./components/LeftPanel/LeftPanel.svelte";
    import ListWrapper from "./components/ListWrapper/ListWrapper.svelte";
    import { APP, initApp } from "../lib/util";
    import { getLayoutList, getCheckList, setCheckList } from "../utils/utils";
    import { DEFAULT_DATA, CONTEXT_NAME } from "./constants";
    import '../common/common.css';

    let isMultiLayout: boolean;
    let isLoading = true;

    // context data type
    type Data = {
        layoutList: any;
        checklistData: any;
        activeTemplate: string;
    };

    let data = writable<Data | {}>({});
    setContext(CONTEXT_NAME, data);

    onMount(async () => {
        await initApp();
        console.log($APP);

        try {
            // getting edition of this portal
            let edition = await ZOHODESK.get("portal");
            let response = edition.portal.plan || {};
            isMultiLayout = response === "ENTERPRISE EDITION";

            // get the stored DB data
            let checkList = await getCheckList();
            let checkListData: any;
            if (Object.keys(checkList).length === 0) {
                checkListData = { ...DEFAULT_DATA };
            } else {
                checkListData = checkList;
            }

            if (isMultiLayout) {
                // get layouts for layout specified templates
                let layoutList = await getLayoutList();
                if(Object.keys(layoutList).length <= 1) {
                    isMultiLayout = false;
                }
                data.set({
                    layoutList,
                    checkListData,
                    activeTemplate: 'default',
                    isSaved: true
                });
            } else {
                data.set({
                    checkListData,
                    activeTemplate: 'default'
                });
            }
            isLoading = false;

            // set the value to DB
            setCheckList(checkListData);
        } catch (error) {
            ZOHODESK.notify({
                title : "Error",
                content : `Something went wrong, Please reload the extension`,
                icon:"success",
                autoClose: false
            });
            throw new Error("check the onmount method in app");
        }
    });
</script>

<main class="cover dflex flexDir">
    <Band>
        <Text slot="left" weight="medium" size="large">
            Create your Checklist
        </Text>
    </Band>
    {#if isLoading}
        <div>Loading...</div>
    {:else}
        <div class="dflex flexible">
            {#if isMultiLayout}
                <LeftPanel />
            {/if}
            <ListWrapper isMultiLayout={isMultiLayout}/>
        </div>
    {/if}
</main>

<style>
    :global(#app) {
        height: 100vh;
    }
</style>
