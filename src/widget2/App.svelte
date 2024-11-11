<script lang="ts">
    import { onMount, setContext } from "svelte";
    import { writable } from "svelte/store";
    import { Text } from "deskblocks";
    import { APP, initApp } from "../lib/util";
    import ListPage from "./ListPage/ListPage.svelte";
    import Band from "../components/Band/Band.svelte";
    import {
        getTicket,
        getCheckList,
        getCheckList_ticket,
    } from "../utils/utils";
    import { CONTEXT_NAME } from "./constants";
    import "../common/common.css";

    // context data type
    type Data = {
        checklistData: any;
        ticketId: number;
    };

    let data = writable<Data | {}>({});
    setContext(CONTEXT_NAME, data);

    let isLoading = true;

    const getDetails = async () => {
        console.log("fn called...");

        let ticket;
        
        try {
            let ticketData = await ZOHODESK.get("ticket");
            ticket = ticketData.ticket;
            console.log(ticket, "ticketData");
        } catch (error) {
            console.log(error);
        }

        let checkListData;

        try {
            let checkListTicket = await getCheckList_ticket(ticket.id);
            checkListData = [...checkListTicket];
        } catch (error) {
            let layoutId = await getTicket(ticket.id);
            let checkList = await getCheckList();
            let list = checkList[layoutId]
                ? checkList[layoutId]
                : checkList["default"];
            checkListData = [...list];
        }
        data.set({ checkListData, ticketId: ticket.id });
        isLoading = false;
    };

    onMount(async () => {
        await initApp();
        console.log($APP);

        $APP?.instance.on("ticket_Shift", async () => {
            console.log("first");
            await getDetails();
        });
        await getDetails();
    });
</script>

<main class="cover dflex flexDir">
    <Band>
        <Text weight="bold" slot="left">CheckList</Text>
    </Band>
    {#if isLoading}
        <div>Loading...</div>
    {:else}
        <ListPage />
    {/if}
</main>

<style>
    :global(#app) {
        height: 100vh;
    }
</style>
