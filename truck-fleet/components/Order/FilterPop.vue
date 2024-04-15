<script lang="ts" setup>

</script>

<template>
  <div>
    <Popover>
      <PopoverTrigger>
        <Button icon="i-material-symbols-filter-alt" size="icon" variant="outline" />
      </PopoverTrigger>
      <PopoverContent>
        <div class="flex flex-col gap-2">
          <slot />
        </div>
      </PopoverContent>
    </Popover>
  </div>
</template>

<style lang="scss"></style>
