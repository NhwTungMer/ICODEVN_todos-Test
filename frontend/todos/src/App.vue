<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import TodoForm from './components/TodoForm.vue'

const todos = ref([])
const filter = ref('all')
const selectedTodo = ref(null)
const showForm = ref(false)
const isEdit = ref(false)
const loading = ref(false)
const apiUrl = 'http://localhost:3000/api/todos'

// Pagination
const page = ref(1)
const pageSize = 6
const totalPages = computed(() => Math.ceil(todos.value.length / pageSize))

const paginatedTodos = computed(() => {
  const start = (page.value - 1) * pageSize
  return todos.value.slice(start, start + pageSize)
})

async function fetchTodos() {
  try {
    loading.value = true
    let url = apiUrl
    if (filter.value === 'completed' || filter.value === 'incomplete') {
      url = apiUrl + '/filter?status=' + filter.value
    }
    const res = await axios.get(url)
    todos.value = res.data.todos || []
    page.value = 1 // reset về trang đầu khi filter
  } catch (error) {
    console.error('Lỗi khi tải danh sách:', error)
    todos.value = []
  } finally {
    loading.value = false
  }
}

function openCreateForm() {
  selectedTodo.value = {}
  isEdit.value = false
  showForm.value = true
}

function openEditForm(todo) {
  selectedTodo.value = { ...todo }
  isEdit.value = true
  showForm.value = true
}

async function handleSubmit(form) {
  try {
    if (isEdit.value) {
      await axios.put(apiUrl + '/' + selectedTodo.value.id, {
        ...form,
        is_completed: selectedTodo.value.is_completed
      })
    } else {
      await axios.post(apiUrl, form)
    }
    showForm.value = false
    fetchTodos()
  } catch (error) {
    console.error('Lỗi khi lưu:', error)
    alert('Có lỗi xảy ra khi lưu công việc')
  }
}

function handleCancel() {
  showForm.value = false
}

async function deleteTodo(id) {
  if (!confirm('Bạn có chắc muốn xóa công việc này?')) return
  try {
    await axios.delete(apiUrl + '/' + id)
    fetchTodos()
  } catch (error) {
    console.error('Lỗi khi xóa:', error)
    alert('Có lỗi xảy ra khi xóa công việc')
  }
}

async function toggleComplete(todo) {
  try {
    await axios.put(apiUrl + '/' + todo.id, {
      title: todo.title,
      description: todo.description,
      due_date: todo.due_date,
      is_completed: todo.is_completed ? 0 : 1
    })
    fetchTodos()
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái:', error)
    alert('Có lỗi xảy ra khi cập nhật trạng thái')
  }
}

function prevPage() {
  if (page.value > 1) page.value--
}
function nextPage() {
  if (page.value < totalPages.value) page.value++
}

async function markAsCompleted(todo) {
  try {
    await axios.put(apiUrl + '/' + todo.id + '/complete')
    fetchTodos()
  } catch (error) {
    console.error('Lỗi khi đánh dấu hoàn thành:', error, error?.response?.data)
    alert('Có lỗi xảy ra khi đánh dấu hoàn thành')
  }
}

onMounted(fetchTodos)
</script>

<template>
  <div class="container">
    <h1>📝 Quản lý công việc</h1>
    
    <button @click="openCreateForm" class="create-btn">
      ✨ Thêm công việc mới
    </button>

    <div class="filter-group">
      <label>🔍 Lọc theo trạng thái:</label>
      <select v-model="filter" @change="fetchTodos">
        <option value="all">Tất cả</option>
        <option value="completed">✅ Đã hoàn thành</option>
        <option value="incomplete">⏳ Chưa hoàn thành</option>
      </select>
    </div>

    <div v-if="loading" class="empty-state">
      <h3>⏳ Đang tải...</h3>
    </div>

    <div v-else-if="paginatedTodos.length === 0" class="empty-state">
      <h3>📝 Chưa có công việc nào</h3>
      <p>Hãy thêm công việc đầu tiên của bạn!</p>
    </div>

    <ul v-else class="todo-list">
      <li v-for="todo in paginatedTodos" :key="todo.id" :class="{ completed: todo.is_completed }">
        <div class="todo-main">
          <span class="todo-title">{{ todo.title }}</span>
          <span class="todo-date">
            📅 {{ todo.due_date ? new Date(todo.due_date).toLocaleDateString('vi-VN') : 'Không có hạn' }}
          </span>
          <span v-if="todo.is_completed" class="todo-status done">✅ Đã hoàn thành</span>
          <span v-else class="todo-status not-done">⏳ Chưa hoàn thành</span>
        </div>
        <div v-if="todo.description" class="todo-desc">
          {{ todo.description }}
        </div>
        <div class="todo-actions">
          <button v-if="!todo.is_completed" @click="markAsCompleted(todo)" title="Đánh dấu đã hoàn thành">
            ✔️ Hoàn thành
          </button>
          <button v-if="!todo.is_completed" @click="openEditForm(todo)" title="Chỉnh sửa">
            ✏️ Sửa
          </button>
          <button @click="deleteTodo(todo.id)" title="Xóa">
            🗑️ Xóa
          </button>
        </div>
      </li>
    </ul>

    <div v-if="totalPages > 1" class="pagination">
      <button @click="prevPage" :disabled="page === 1" title="Trang trước">
        ← Trước
      </button>
      <span>Trang {{ page }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="page === totalPages" title="Trang sau">
        Sau →
      </button>
    </div>

    <TodoForm
      :visible="showForm"
      :todo="selectedTodo"
      :isEdit="isEdit"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>
