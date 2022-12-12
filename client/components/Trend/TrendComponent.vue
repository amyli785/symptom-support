<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article class="trend-container">
    <h2>
        <strong>{{title}}</strong>
    </h2>
    <section
      v-if="trendItems.length"
    >
      <section v-if="trendItems.length">
        <p class="trend-item"
          v-for="trend in trendItems"
          v-if="(typeof trend.value) === (typeof 1) && trend.changeAmt"
        >
          <strong>{{trend.display}}:</strong> {{trend.value}} <span class="change-amt">({{trend.changeAmt}})</span>
        </p>
        <p class="trend-item"
          v-else-if="(typeof trend.value) === (typeof 1)"
        >
          <strong>{{trend.display}}:</strong> {{trend.value}}
        </p>
        <p class="trend-item"
          v-else-if="trend.value[0].changeAmt"
        >
          <strong>{{trend.display}}:</strong> <br>
          <i>- {{trend.value[0].display}}:</i> {{trend.value[0].value}} <span class="change-amt">({{trend.value[0].changeAmt}})</span><br>
          <i>- {{trend.value[1].display}}:</i> {{trend.value[1].value}} <span class="change-amt">({{trend.value[1].changeAmt}})</span>
        </p>
        <p class="trend-item"
          v-else
        >
          <strong>{{trend.display}}:</strong> <br>
          <i>- {{trend.value[0].display}}:</i> {{trend.value[0].value}} <br>
          <i>- {{trend.value[1].display}}:</i> {{trend.value[1].value}} 
        </p>
      </section>
    </section>
  </article>
</template>

<script>
export default {
    name: 'TrendComponent',
    components: {
    },
    props: {
      // Data from the stored supporter
      title: {
        type: String,
        required: true
      },
      trendItems: {
        type: Array,
        required: true
      }
    },
};
</script>

<style scoped>

.trend-container {
  background-color: #ffffff;
  filter: drop-shadow(0 0 2px var(--dark-blue-drop-shadow));
  color: black;
  border-radius: 20px;
  padding: 20px;

  flex-basis: calc(33%);

  gap: 12px;
}

.change-amt {
  color: var(--salmon)
}

.change-amt-red{
  color: var(--salmon)
}

.change-amt-green{
  color: var(--light-blue)
}

</style>