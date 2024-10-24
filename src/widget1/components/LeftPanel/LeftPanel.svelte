<script lang="ts">
    import { getContext, onDestroy } from 'svelte';
    import { Text, Icon, Button } from "deskblocks";
    import { IconPlus } from "deskblocks/icons";
    import PanelList from "../PanelList/PanelList.svelte";
    import Dropbox from "../Dropbox/Dropbox.svelte";
    import "../../../common/common.css";
    import style from "./LeftPanel.module.css"; 

    let isPopupOpen = false;
    const toggleDropbox = () => {
        isPopupOpen = !isPopupOpen;
    };

    const sharedData:any = getContext('global_checklist_data');
    let data:any;

    const unsubscribe = sharedData.subscribe((value:any) => {
        console.log(value);
        
        data = value
    });

    onDestroy(() => {
        unsubscribe();
    });

    // let data:any = getContext('global_checklist_data');
    const { layoutList={}, checkListData={}, activeTemplate, handleAddTemplate } = $sharedData;
    const addedLayoutList = Object.keys(checkListData).filter(value=>value!=='default');

    const handleAdd = (e:any, id:string) => {
        let obj = {
            [id]: []
        }
        sharedData.update((data:any) => ({ ...data, checkListData: {...obj, ...checkListData} }));
        console.log(data, '...');
    }
</script>

<div class={`${style.container} noShrink dflex flexDir cnt`}>
    <div class={`${style.default}`}>
        <PanelList 
            text="Default Template" 
            isActive={data.activeTemplate === 'default'}
            needDelete={false}
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
                options={Object.values(layoutList)} 
                onClick={handleAdd}
            />
        {/if}
    </div>
    <div class={`${style.content} flexible scrollY`}>
        {#each addedLayoutList as template}
            <PanelList 
                text={layoutList[`${template}`].text} 
                isActive={activeTemplate === layoutList[template].id}
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
