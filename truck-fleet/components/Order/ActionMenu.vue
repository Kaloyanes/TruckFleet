<script lang="ts" setup></script>

<template>
  <ContextMenu>
    <ContextMenuTrigger>
      <slot />
    </ContextMenuTrigger>
    <ContextMenuContent>
      <div class="flex flex-col gap-2">
        <Button variant="outline" class="m-0">Edit</Button>
        <Button
          variant="destructive"
          class="m-0"
          @click="console.log('fakosfksao')"
        >
          Delete
        </Button>
      </div>
    </ContextMenuContent>
  </ContextMenu>
</template>

<style lang="scss"></style>
