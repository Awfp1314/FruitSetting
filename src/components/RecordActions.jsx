import { Trash2, Edit } from 'lucide-react';

const RecordActions = ({ onEdit, onDelete, canDelete = true }) => {
  return (
    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
      <button
        onClick={onEdit}
        className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100 active:scale-95 transition-all"
      >
        <Edit size={16} />
        编辑
      </button>
      {canDelete && (
        <button
          onClick={onDelete}
          className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 active:scale-95 transition-all"
        >
          <Trash2 size={16} />
          删除
        </button>
      )}
    </div>
  );
};

export default RecordActions;
