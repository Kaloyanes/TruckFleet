<script lang="ts" setup>
let user = useCurrentUser();
let db = useFirestore();

const { data: profile, promise: profilePromise } = useProfileDoc();

let profilePicture = computed(
  () => profile?.value?.profilePicture || undefined,
);

const links = [
  {
    title: "Chats",
    href: "/dashboard/chats",
    icon: "i-material-symbols-chat",
  },
  {
    title: "Home",
    href: "/dashboard/home",
    icon: "i-material-symbols-home-outline-rounded",
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: "i-material-symbols-receipt",
  },
  {
    title: "Trucks",
    href: "/dashboard/trucks",
    icon: "i-heroicons-truck",
  },
  {
    title: "Companies",
    href: "/dashboard/companies",
    icon: "i-material-symbols-home-work-outline-rounded",
  },
];

const endLinks = [
  {
    title: "Logout",
    href: "/logout",
    icon: "i-material-symbols-logout-rounded",
  },
];

const profileLink = {
  title: "Profile",
  href: "/dashboard/profile/account",
  icon: "i-heroicons-user-circle",
};

onMounted(() => {
  animate(
    ".navigation-item",
    {
      scale: [0.6, 1.1, 1],
      opacity: [0, 1],
      rotate: [45, 0],
      filter: ["blur(15px)", "blur(0px)"],
    },
    {
      duration: 0.7,
      easing: spring({
        damping: 10,
        stiffness: 100,
        mass: 0.7,
      }),
      delay: stagger(0.07, {
        from: "first",
        start: 0.4,
      }),
    },
  );
});
</script>

<template>
  <div class="flex h-screen flex-col items-center gap-5 py-5">
    <DashboardLogo />
    <div class="flex-1" />

    <DashboardItem
      v-for="(link, index) in links"
      :link="link"
      :exact-type="false"
      :delayMs="index * 100"
    />
    <div class="flex-1" />

    <div>
      <DashboardItem
        :link="{
          title: profile?.name,
          href: '/dashboard/profile',
        }"
        v-if="profilePicture"
        :delayMs="links.length * 100"
      >
        <template #icon>
          <Avatar class="h-6 w-6">
            <AvatarImage :src="profilePicture" alt="Profile Picture" />
          </Avatar>
        </template>
      </DashboardItem>
      <DashboardItem v-else :link="profileLink" />
    </div>
    <DashboardItem v-for="(link, index) in endLinks" :link="link" />
  </div>
</template>

<style lang="scss"></style>
