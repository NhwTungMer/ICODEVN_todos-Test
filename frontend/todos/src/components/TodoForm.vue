<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  todo: { type: Object, default: () => ({}) },
  visible: { type: Boolean, default: false },
  isEdit: { type: Boolean, default: false }
})

const emit = defineEmits(['submit', 'cancel'])

const form = reactive({
  title: '',
  description: '',
  due_date: ''
})

const errors = reactive({
  title: ''
})

watch(() => props.todo, (val) => {
  if (!val || typeof val !== 'object') {
    form.title = ''
    form.description = ''
    form.due_date = ''
  } else {
    form.title = val.title || ''
    form.description = val.description || ''
    if (val.due_date) {
      let dateStr = val.due_date
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        dateStr = dateStr.slice(0, 10)
      }
      const d = new Date(dateStr)
      if (!isNaN(d)) {
        d.setDate(d.getDate() + 1)
        form.due_date = d.toISOString().split('T')[0]
      } else {
        form.due_date = ''
      }
    } else {
      form.due_date = ''
    }
  }
  errors.title = ''
}, { immediate: true })

function validateForm() {
  errors.title = ''
  
  if (!form.title.trim()) {
    errors.title = 'Tiêu đề không được để trống'
    return false
  }
  
  if (form.title.trim().length < 3) {
    errors.title = 'Tiêu đề phải có ít nhất 3 ký tự'
    return false
  }
  
  return true
}

function handleSubmit() {
  if (!validateForm()) return
  
  let dueDateToSend = form.due_date
  if (!dueDateToSend && props.todo && props.todo.due_date) {
    dueDateToSend = props.todo.due_date
  }
  emit('submit', {
    title: form.title.trim(),
    description: form.description.trim(),
    due_date: dueDateToSend
  })
}

function handleCancel() {
  emit('cancel')
  // Reset form
  form.title = ''
  form.description = ''
  form.due_date = ''
  errors.title = ''
}

// Close modal when clicking outside
function handleOverlayClick(event) {
  if (event.target === event.currentTarget) {
    handleCancel()
  }
}
</script>

<template>
  <div v-if="visible" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content">
      <h2>{{ isEdit ? '✏️ Cập nhật công việc' : '✨ Thêm công việc mới' }}</h2>
      
      <form @submit.prevent="handleSubmit" class="todo-form-modal">
        <div class="form-group">
          <label for="title">📝 Tiêu đề *</label>
          <input 
            id="title"
            v-model="form.title" 
            placeholder="Nhập tiêu đề công việc..." 
            required 
            :class="{ error: errors.title }"
            @input="errors.title = ''"
          />
          <span v-if="errors.title" class="error-message">{{ errors.title }}</span>
        </div>
        
        <div class="form-group">
          <label for="description">📄 Mô tả</label>
          <textarea 
            id="description"
            v-model="form.description" 
            placeholder="Mô tả chi tiết (tùy chọn)..."
            rows="3"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label for="due_date">📅 Ngày hết hạn</label>
          <input 
            id="due_date"
            v-model="form.due_date" 
            type="date" 
            :min="new Date().toISOString().split('T')[0]"
          />
        </div>
        
        <div class="modal-actions">
          <button type="submit" class="btn-primary">
            {{ isEdit ? '💾 Cập nhật' : '✅ Tạo mới' }}
          </button>
          <button type="button" @click="handleCancel" class="btn-secondary">
            ❌ Hủy
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 1rem;
  transition: border-color 0.3s ease;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.1);
}

.form-group input.error {
  border-color: var(--secondary-color);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.error-message {
  display: block;
  margin-top: 0.5rem;
  color: var(--secondary-color);
  font-size: 0.875rem;
  font-weight: 500;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  color: white;
  border: none;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: var(--text-secondary);
  color: white;
  border: none;
}

.btn-secondary:hover {
  background: #5a6268;
}
</style> 