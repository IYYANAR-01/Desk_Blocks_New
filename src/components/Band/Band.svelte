<script>
    import '../../common/common.css';
    import style from './Band.module.css';
    export let type = "topBand";
</script>

<div class={`${style.container} ${style[type]} dflex noShrink`}>
    <div class={`${style.leftbox} flexible dflex alignCenter`}>
        <slot name="left"/>
    </div>
    <div class={`${style.rightbox} noShrink dflex alignCenter`}>
        <slot name="right"/>
    </div>
</div>