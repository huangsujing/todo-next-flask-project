import { Check } from 'lucide-react';

/** 待办项数据结构 */
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  /** 列表索引，用于错峰入场动画 */
  index: number;
}

/**
 * 单条待办条目组件
 * 展示标题与完成状态，勾选后标题划线置灰；不持有自身状态，由父组件统一管理
 */
export default function TodoItem({ todo, onToggle, index }: TodoItemProps) {
  return (
    <li
      className="group flex items-center gap-4 rounded-2xl border border-sand bg-paper px-5 py-4 shadow-sm transition-all duration-300 hover:border-terracotta/30 hover:shadow-md"
      style={{
        animation: 'fade-in-up 0.5s ease-out backwards',
        animationDelay: `${index * 60}ms`,
      }}
    >
      {/* 圆形勾选框（点击热区 44px，便于触控） */}
      <button
        type="button"
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? '标记为未完成' : '标记为已完成'}
        aria-pressed={todo.completed}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-terracotta/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/40"
      >
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-300 ${
            todo.completed
              ? 'border-terracotta bg-terracotta text-white'
              : 'border-sand bg-transparent group-hover:border-terracotta/50'
          }`}
        >
          {todo.completed && (
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          )}
        </span>
      </button>

      {/* 待办标题：完成后划线置灰 */}
      <span
        className={`flex-1 text-base transition-colors duration-300 ${
          todo.completed ? 'text-ink-muted line-through' : 'text-ink'
        }`}
      >
        {todo.title}
      </span>
    </li>
  );
}
