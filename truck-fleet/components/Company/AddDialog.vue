<script setup>
const isModalOpen = useState('addCompanyModal', () => false)
const isAddOrderOpen = useState('addOrder');

function open() {
  isAddOrderOpen.value = false
  isModalOpen.value = true

}

</script>

<template>
  <!-- <UButton @click="open" variant="soft" class="flex-1 flex justify-center self-center">Add
    Company
  </UButton> -->

  <Dialog :open="isModalOpen" @update:open="(e) => isModalOpen = e">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add Company</DialogTitle>
      </DialogHeader>
      <div class="flex flex-col gap-3">
        <UInput v-model="companyName" placeholder="Company Name" />
        <UInput v-model="companyAddress" placeholder="Company Address" />
        <UInput v-model="companyPhone" placeholder="Company Phone" />
        <UInput v-model="companyEmail" placeholder="Company Email" />

        <div class="sticky bottom-3 flex justify-evenly px-8 gap-3 pt-5 ">

          <DialogClose as-child>
            <UButton variant="soft" class="flex-1 flex justify-center">Close</UButton>
          </DialogClose>
          <DialogClose as-child>
            <UButton @click="addCompany" class="flex-1 flex justify-center">Add Company</UButton>
          </DialogClose>
        </div>

      </div>
    </DialogContent>
  </Dialog>
</template>
