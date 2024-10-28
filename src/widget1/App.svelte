<script lang="ts">
    import { onMount, setContext, getContext } from "svelte";
    import { writable } from "svelte/store";
    import { Text } from "deskblocks";
    import Band from "../components/Band/Band.svelte";
    import LeftPanel from "./components/LeftPanel/LeftPanel.svelte";
    import ListWrapper from "./components/ListWrapper/ListWrapper.svelte";
    import { APP, initApp } from "../lib/util";
    import { getLayoutList, getCheckList } from "./utils/utils";
    import { DEFAULT_DATA, CONTEXT_NAME } from "./constants";

    let isEnterpriseEdition: boolean;
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
            isEnterpriseEdition = response === "ENTERPRISE EDITION";

            // get the stored DB data
            let checkList = await getCheckList();
            let checkListData: any;
            if (Object.keys(checkList).length === 0) {
                checkListData = { ...DEFAULT_DATA };
            }

            if (isEnterpriseEdition) {
                // get layouts for layout specified templates
                let layoutList = await getLayoutList();
                data.set({
                    layoutList,
                    checkListData,
                    activeTemplate: 'default'
                });
            }
            isLoading = false;
        } catch (error) {
            throw error;
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
            {#if isEnterpriseEdition}
                <LeftPanel />
            {/if}
            <ListWrapper isEnterpriseEdition={isEnterpriseEdition}/>
        </div>
    {/if}
</main>

<style>
    :global(#app) {
        height: 100vh;
    }
</style>
