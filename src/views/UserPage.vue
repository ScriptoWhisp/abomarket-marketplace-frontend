<script setup>

import HeaderPopover from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

let sectionId = 0;


</script>

<template>


  <header class="bg-black w-full">
    <HeaderPopover/>
  </header>


  <body>
  <aside id="default-sidebar" class="w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
    <div class="h-full px-3 py-4 overflow-y-auto bg-white">
      <ul class="space-y-2 font-medium">
        <li>
          <a href="#" class="flex items-center p-2 text-gray-900 rounded-lg focus:bg-gray-300 hover:bg-gray-300 group">
            <span class="ms-3">Dashboard</span>
          </a>
        </li>
      </ul>
    </div>
  </aside>
  </body>


  <footer>
    <Footer/>
  </footer>


</template>
