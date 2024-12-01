<script lang="ts">
    import style from './Textbox.module.css';
    export let value = '';
    export let placeholder = "+ Add Checklist";
    export let handleKey;
    export let handleBlur;
    export let ref;
</script>

<input 
    placeholder={placeholder}
    class={style.input}
    bind:value={value}
    on:keyup={handleKey}
    on:blur={handleBlur}  
    bind:this={ref}
    autofocus={true}
/>