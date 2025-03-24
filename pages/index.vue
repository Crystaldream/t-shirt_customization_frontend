<template>
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; width: 100vw;">
        <div>
        <table style="width: 90%; max-width: 1600px; border-collapse: collapse; text-align: center; margin: auto; font-size: 0.5 em;">
            <thead>
            <tr>
                <th style="border-right: 5px solid #ddd; border-bottom: 5px solid #ddd; padding: 16px; width: 200px; color: #808080; font-weight: normal; font-family: Verdana, sans-serif; font-size: 16px;">Item Id</th>
                <th style="border-right: 5px solid #ddd; border-bottom: 5px solid #ddd; padding: 16px; width: 200px; color: #808080; font-weight: normal; font-family: Verdana, sans-serif; font-size: 16px;">Item Name</th>
                <th style="border-right: 5px solid #ddd; border-bottom: 5px solid #ddd; padding: 16px; width: 200px; color: #808080; font-weight: normal; font-family: Verdana, sans-serif; font-size: 16px;">Nº Colors</th>
                <th style="border-right: 5px solid #ddd; border-bottom: 5px solid #ddd; padding: 16px; width: 200px; color: #808080; font-weight: normal; font-family: Verdana, sans-serif; font-size: 16px;">Nº Fabrics</th>
                <th style="border-right: 5px solid #ddd; border-bottom: 5px solid #ddd; padding: 16px; width: 200px; color: #808080; font-weight: normal; font-family: Verdana, sans-serif; font-size: 16px;">Nº Images</th>
                <th style="border-bottom: 5px solid #ddd; padding: 16px; width: 200px"></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in items" :key="item.id">
                <td style="border-right: 5px solid #ddd; padding: 16px; color: #808080; font-weight: normal; font-family: Verdana, sans-serif; font-size: 16px;">{{ item.id }}</td>
                <td style="border-right: 5px solid #ddd; padding: 16px; color: #808080; font-weight: normal; font-family: Verdana, sans-serif; font-size: 16px;">{{ item.name }}</td>
                <td style="border-right: 5px solid #ddd; padding: 16px; color: #808080; font-weight: normal; font-family: Verdana, sans-serif; font-size: 16px;">{{ item.colorCount }}</td>
                <td style="border-right: 5px solid #ddd; padding: 16px; color: #808080; font-weight: normal; font-family: Verdana, sans-serif; font-size: 16px;">{{ item.fabricCount }}</td>
                <td style="border-right: 5px solid #ddd; padding: 16px; color: #808080; font-weight: normal; font-family: Verdana, sans-serif; font-size: 16px;">{{ item.imageCount }}</td>
                <td>
                <button @click="goToUploadPage(item.id)" style="width: 200px; color: #808080; font-weight: normal; font-family: Verdana, sans-serif; font-size: 14px;">Edit Images</button>
                </td>
            </tr>
            </tbody>
        </table>
        </div>
    </div>
</template>

<script setup>

    import { ref, onMounted } from 'vue';

    const items = ref([]);

    const fetchItems = async () => {

        const response = await fetch('http://localhost:5047/api/items');
        items.value = await response.json();

    };

    const goToUploadPage = (id) => {
        navigateTo(`/upload?id=${id}`);
    };

    onMounted(fetchItems);

</script>
