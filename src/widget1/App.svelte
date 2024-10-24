<script lang="ts">
    import { onMount, setContext } from "svelte";
    import { writable } from "svelte/store";
    import { APP, initApp } from "../lib/util";
    import { Text } from "deskblocks";
    import Band from "../components/Band/Band.svelte";
    import LeftPanel from "./components/LeftPanel/LeftPanel.svelte";
    import ListWrapper from "./components/ListWrapper/ListWrapper.svelte";
    import { DB } from "../lib/util";
    import { getLayoutList } from "./utils/utils";
    import "../common/common.css";

    let isEnterpriseEdition: boolean;
    let activeTemplate: string = "default";
    let isLoading = true;

    type Data = {
        layoutList: any;
        checklistData: any;
        activeTemplate: string;
    };

    let data = writable<Data | {}>({});
    setContext("global_checklist_data", data);

    const getCheckList = async () => {
        const data = await DB.get({
            key: "checkList",
            queriableValue: "checkList_extension",
            from: 0,
        });
        return data["database.get"];
    };

    // const handleSetContext = (data:any) => {
    // }

    // $: if(!isLoading) {
    //     handleSetContext(data);
    // }

    // handleActiveTemplate: ({ value }: { value: string }) => {
    //                     activeTemplate = value;
    //                 },
    //                 handleAddTemplate: ({ value }: { value: string }) => {
    //                     checkListData[value] = [];
    //                     console.log(checkListData, "...");
    //                 },

    onMount(async () => {
        await initApp();
        console.log($APP);
        try {
            let edition = await ZOHODESK.get("portal");
            let response = edition.portal.plan || {};
            isEnterpriseEdition = response === "ENTERPRISE EDITION";

            let checkList = await getCheckList();
            let checkListData: any;
            if (Object.keys(checkList).length === 0) {
                let defaultData = {
                    default: [
                        {
                            text: "CheckList 1",
                            isChecked: false,
                        },
                        {
                            text: "CheckList 2",
                            isChecked: false,
                        },
                        {
                            text: "CheckList 3",
                            isChecked: false,
                        },
                        {
                            text: "CheckList 4",
                            isChecked: false,
                        },
                    ],
                };
                checkListData = { ...defaultData };
            }

            if (isEnterpriseEdition) {
                let layoutList = await getLayoutList();
                data.set({
                    layoutList,
                    checkListData,
                    activeTemplate,
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
            <ListWrapper />
        </div>
    {/if}
</main>

<style>
    :global(#app) {
        height: 100vh;
    }
</style>
