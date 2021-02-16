<template>
  <div
    class="reveal"
    @click="revealClicked"
    @mouseover="hoverOnReveal = clickable"
    @mouseleave="hoverOnReveal = false"
    :class="{
      pointer: hoverOnReveal,
      'hvr-icon-hang': hoverOnReveal,
      'greyed-out': !clickable,
    }"
  >
    <p :style="textStyle">
      {{ revealText }}
    </p>
    <img :style="chevronStyle" class="hvr-icon" src="../../assets/down-chevron.png" />
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'ClickToReveal',
  props: {
    revealText: String,
    sizeFactor: Number,
    shouldBoldText: Boolean,
    clickable: Boolean,
  },
  emits: ['revealClicked'],
  setup(props, context) {
    const hoverOnReveal = ref(false);

    const textStyle = computed(() => {
      const styleObject = {
        fontSize: `${props.sizeFactor}em`,
      };
      if (props.shouldBoldText) {
        styleObject.fontWeight = '750';
      }
      return styleObject;
    });

    const chevronStyle = computed(() => {
      const dimensionScale = `${25 * props.sizeFactor}px`;
      const styleObject = {
        height: 'auto',
        width: 'auto',
        maxWidth: dimensionScale,
        maxHeight: dimensionScale,
        marginTop: '0px',
      };
      if (!props.shouldBoldText) {
        styleObject.opacity = '0.7';
      }
      return styleObject;
    });

    const revealClicked = () => {
      console.log('reveal clicked!');
      if (props.clickable) {
        context.emit('revealClicked');
      }
    };

    return {
      textStyle,
      chevronStyle,
      hoverOnReveal,
      revealClicked,
    };
  },
};
</script>

<style lang="css" scoped>
.reveal {
  display: inline-block;
}

p {
  margin-bottom: 0;
  font-size: 1em;
}

.pointer {
  cursor: pointer;
}

.greyed-out {
  opacity: 0.3;
}
</style>
