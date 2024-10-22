<script lang="ts">
    import { onMount } from "svelte";
    import { APP, initApp } from "../lib/util";
    import { Text } from 'deskblocks';
    import Band from "../components/Band/Band.svelte";
    import '../common/common.css';
    import LeftPanel from "./components/LeftPanel/LeftPanel.svelte";
    import ListWrapper from "./components/ListWrapper/ListWrapper.svelte";

    let isEnterpriseEdition:boolean;

    onMount(async () => {
        await initApp();
        console.log($APP);
        ZOHODESK.get("portal")
        .then((res:any) => {
            let response = res.portal.plan || {};
            isEnterpriseEdition = response === 'ENTERPRISE EDITION';
            console.log(isEnterpriseEdition);
        })
        .catch((err:any) => {
            console.log('first')
            throw err + "kjbdcjhb...";
        })
    });
</script>

<main class="cover dflex flexDir">
    <Band>
        <Text 
            slot="left" 
            weight="medium" 
            size="large"
        >
            Create your Checklist
        </Text>
    </Band>
    <div class="dflex flexible">
        {#if isEnterpriseEdition}
            <LeftPanel/>
        {/if}
        <ListWrapper/>
    </div>
</main>

<style>
    :global(#app){
        height: 100vh;
    }
</style>