<script lang="ts">
    import { getContext } from "svelte";
    import { Text } from "deskblocks";
    import PanelList from "../PanelList/PanelList.svelte";
    import { CONTEXT_NAME, type DATA_TYPE, type LAYOUTDATA_TYPE } from "../../constants/index";
    import "../../../common/common.css";
    import style from "./LeftPanel.module.css";

    const context_data:any = getContext(CONTEXT_NAME);
    let data:any = Object.values($context_data.layoutList).reduce((acc:any, cur:any) => {
        const { departmentId } = cur;
        if(acc[departmentId]) {
            acc[departmentId].push(cur);
        } else {
            acc[departmentId] = [cur];
        }
        return acc;
    }, {});
    let departmentIds:string[] = Object.keys(data);

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

</script>

<div class={`${style.container} noShrink dflex flexDir cnt`}>
    <div class={`${style.default}`}>
        <PanelList 
            id="default"
            text="Default Checklist" 
            isActive={$context_data?.activeTemplate === "default"} 
            onClick={handleSelect}
        />
    </div>
    <div class={`${style.header} dflex alignCenter noShrink`}>
        <Text weight="medium" class={style.heading}>Layouts</Text>
    </div>

    <div class={`${style.content} flexible scrollY`}>
        {#each departmentIds as key, index}
            <Text size="small" tag="p" class={style.department}>Department {index + 1}</Text>
            {#each data[key] as layout}
                <PanelList
                    onClick={handleSelect}
                    id={layout.id}
                    text={layout.text}
                    isActive={$context_data.activeTemplate === layout.id}
                />
            {/each}
        {/each}
    </div>
</div>

<style>
    .cnt :global(.btn) {
        height: 32px;
        width: 100%;
    }
</style>
