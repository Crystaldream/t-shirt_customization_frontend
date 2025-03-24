
<template>
  <div>
    <h1>Items List</h1>
    <table>
      <thead>
        <tr>
          <th>Item Id</th>
          <th>Item Name</th>
          <th>Nº Colors</th>
          <th>Nº Fabrics</th>
          <th>Nº Images</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.colorCount }}</td>
          <td>{{ item.fabricCount }}</td>
          <td>{{ item.imageCount }}</td>
          <td>
            <button @click="goToUploadPage(item.id)">Edit Photos</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
  
<script setup>

  import { ref, onMounted } from 'vue';
  
  const items = ref([]);
  
  const fetchItems = async () => {

    try {

      const response = await fetch('http://localhost:5047/api/items');
      items.value = await response.json();

    } catch (error) {
      console.error('Error fetching items:', error);
    }

  };
  
  const goToUploadPage = (id) => {
    navigateTo(`/upload?id=${id}`);
  };
  
  onMounted(fetchItems);

</script>
  