<script lang="ts">
    import { onMount, setContext } from "svelte";
    import { writable } from "svelte/store";
    import { APP, initApp } from "../lib/util";
    import ListPage from "./ListPage/ListPage.svelte";
    import {
        getTicket,
        getCheckList,
        getCheckList_ticket,
    } from "../utils/utils";
    import { CONTEXT_NAME, DEFAULT_DATA } from "./constants";
    import "../common/common.css";

    // context data type

    type checklist = {
        [key:string]: {
            text: string,
            isChecked: boolean
        }[]
    };

    type Data = {
        checklistData:checklist,
        ticketId:number
    };

    let data = writable<Data | {}>({});
    setContext(CONTEXT_NAME, data);

    let isLoading:boolean = true;

    const getDetails = async ($APP:any) => {
        // get the ticket data
        let ticket;
        try {
            let ticketData = await ZOHODESK.get("ticket");
            ticket = ticketData.ticket;
        } catch (error) {
            console.log(error);
        }

        let checkListData;
        try {
            // getting stored specified ticket data
            let checkListTicket = await getCheckList_ticket(ticket.id);
            checkListData = [...checkListTicket];
        } catch (error) {
            // getting stored layout specified data
            let domain = $APP?.instance.serviceOrigin;
            let layoutId = await getTicket(ticket.id, domain);
            let checkList = await getCheckList();
            let list = checkList[layoutId]
                ? checkList[layoutId]
                : checkList["default"] || DEFAULT_DATA;
            checkListData = [...list];
        }
        data.set({ checkListData, ticketId: ticket.id });
        isLoading = false;
    };

    onMount(async () => {
        await initApp();
        console.log($APP);

        try {
            // this function for the onChange ticket from detailview 
            $APP?.instance.on("ticket_Shift", ()=>getDetails($APP));
            getDetails($APP); 
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
