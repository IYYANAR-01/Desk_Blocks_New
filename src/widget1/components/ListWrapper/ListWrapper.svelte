<script>   
    import { Text, Icon, Button, TextInput } from "deskblocks";
    import '../../../common/common.css';
    import style from './ListWrapper.module.css';
    import Band from "../../../components/Band/Band.svelte";
</script>

<div class={`${style.container} flexible dflex flexDir`}>
    <div class={style.inputbox}>
        <input 
            placeholder="+ Type and click enter to add"
            class={style.input}
        />
    </div>
    <div class="flexible scrollY">

    </div>
    <Band type="footer">
        <Button slot="left" variant="danger-secondary">Delete Template</Button>
        <div slot="right">
            <Button variant="tertiary">Cancel</Button>
            <Button variant="primary">Save</Button>
        </div>
    </Band>
</div>