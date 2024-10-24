<script>   
    import { Text, Icon, Button, TextInput } from "deskblocks";
    import '../../../common/common.css';
    import style from './ListWrapper.module.css';
    import Band from "../../../components/Band/Band.svelte";
    import List from "../../../components/List/List.svelte";
</script>

<div class={`${style.container} flexible dflex flexDir`}>
    <div class={style.inputbox}>
        <input 
            placeholder="+ Type and click enter to add"
            class={style.input}
        />
    </div>
    <div class={`${style.content} flexible scrollY`}>
        <List
            text={"hello iyyanar"} 
            type="checkList" 
            id={"1"}
            isChecked
            
        />
    </div>
    <Band type="footer">
        <div slot="right">
            <Button variant="tertiary">Cancel</Button>
            <Button variant="primary">Save</Button>
        </div>
    </Band>
</div>