import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Loader2, Plus, Trash2, FileText, Sparkles, Eye, EyeOff } from 'lucide-react';
import { IMAGE_URL } from '../../../constants';

const DynamicForm = ({
  fields,
  onSubmit,
  defaultValues = {},
  loading = false,
  title,
  submitLabel = 'Submit',
}) => {
  const [visiblePasswords, setVisiblePasswords] = React.useState({});
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const watchDOB = watch('dateOfBirth');

  React.useEffect(() => {
    if (watchDOB) {
      const today = new Date();
      const birthDate = new Date(watchDOB);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
      setValue('age', age);
    }
  }, [watchDOB, setValue]);

  const renderField = (field, prefix = '') => {
    const name = prefix ? `${prefix}.${field.name}` : field.name;
    const error = name.split('.').reduce((obj, key) => {
      if (key.includes('[')) {
        const [k, index] = key.replace(']', '').split('[');
        return obj?.[k]?.[index];
      }
      return obj?.[key];
    }, errors);

    if (field.type === 'section') {
      return (
        <div key={field.name} className="col-span-1 md:col-span-2 mt-2 mb-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-700 to-transparent" />
            <span className="text-xs font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] px-2 whitespace-nowrap">
              {field.label}
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-700 to-transparent" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {field.fields.map((f) => renderField(f, name))}
          </div>
        </div>
      );
    }

    if (field.type === 'array') {
      return <ArrayField key={field.name} field={field} control={control} register={register} errors={errors} renderField={renderField} />;
    }

    const validationOptions = {
      required: field.required ? `${field.label} is required` : false,
      minLength: field.minLength,
      maxLength: field.maxLength,
      pattern: field.pattern,
      validate: field.validate,
    };

    const baseInput = `
      w-full px-3 py-2 rounded-xl text-xs font-medium
      bg-white/60 dark:bg-zinc-800/60
      border transition-all duration-200 outline-none
      backdrop-blur-sm
      placeholder:text-zinc-300 dark:placeholder:text-zinc-600
      text-zinc-800 dark:text-zinc-100
      focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10
      focus:border-zinc-400 dark:focus:border-zinc-500
      shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)]
    `;

    const borderClass = error
      ? 'border-red-400/70 bg-red-50/30 dark:bg-red-900/10 focus:ring-red-400/20'
      : 'border-zinc-200 dark:border-zinc-700/80';

    const readOnlyClass = field.readOnly
      ? 'opacity-60 cursor-not-allowed bg-zinc-50/80 dark:bg-zinc-900/50'
      : '';

    return (
      <div key={field.name} className="flex flex-col gap-1.5 group">
        <label className="text-xs font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.18em] flex items-center gap-1">
          {field.label}
          {field.required && <span className="text-red-400">*</span>}
        </label>

        {field.type === 'select' ? (
          <select
            {...register(name, validationOptions)}
            disabled={field.readOnly}
            className={`${baseInput} ${borderClass} ${readOnlyClass} appearance-none cursor-pointer`}
          >
            <option value="">Select {field.label}</option>
            {field.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : field.type === 'textarea' ? (
          <textarea
            {...register(name, validationOptions)}
            readOnly={field.readOnly}
            rows={3}
            className={`${baseInput} ${borderClass} ${readOnlyClass} resize-none`}
          />
        ) : field.type === 'file' ? (
          <div className="space-y-1.5">
            <input
              type="file"
              accept={field.accept}
              {...register(name, validationOptions)}
              className={`w-full px-3 py-1.5 text-xs font-bold rounded-xl border backdrop-blur-sm
                bg-white/60 dark:bg-zinc-800/60 transition-all
                file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0
                file:text-xs file:font-bold file:bg-zinc-900 file:text-white file:cursor-pointer
                hover:file:bg-zinc-700 dark:file:bg-white dark:file:text-zinc-900
                ${borderClass}`}
            />
            {defaultValues[name] && typeof defaultValues[name] === 'string' && (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-100/80 dark:bg-zinc-800/50 rounded-lg w-fit border border-zinc-200 dark:border-zinc-700 backdrop-blur-sm">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-tighter">Current:</span>
                <a
                  href={`${IMAGE_URL}/${defaultValues[name]}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white hover:underline flex items-center gap-0.5 transition-colors"
                >
                  <FileText className="w-2.5 h-2.5" /> View Current File
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="relative w-full">
            <input
              type={field.type === 'password' ? (visiblePasswords[name] ? 'text' : 'password') : (field.type || 'text')}
              readOnly={field.readOnly}
              max={field.max}
              {...register(name, validationOptions)}
              className={`${baseInput} ${borderClass} ${readOnlyClass} ${field.type === 'password' ? 'pr-10' : ''}`}
            />
            {field.type === 'password' && (
              <button
                type="button"
                onClick={() => setVisiblePasswords(prev => ({ ...prev, [name]: !prev[name] }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 transition-colors p-1 cursor-pointer flex items-center justify-center border-0 bg-transparent"
              >
                {visiblePasswords[name] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        )}

        {error && (
          <span className="text-xs font-semibold text-red-500 dark:text-red-400 flex items-center gap-1 mt-0.5">
            <span className="w-1 h-1 rounded-full bg-red-500 inline-block" />
            {error.message || 'Required'}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="
      relative w-full overflow-hidden
      rounded-2xl
      bg-white/70 dark:bg-zinc-900/60
      border border-white/80 dark:border-zinc-700/50
      backdrop-blur-xl
      shadow-[0_8px_32px_rgba(0,0,0,0.06),_0_1px_0_rgba(255,255,255,0.8)_inset]
      dark:shadow-[0_8px_32px_rgba(0,0,0,0.4),_0_1px_0_rgba(255,255,255,0.04)_inset]
      text-xs
      animate-in fade-in slide-in-from-bottom-2 duration-400
    ">
      {/* Subtle top gradient glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/10 to-transparent" />

      <div className="p-5">
        {/* Title */}
        {title && (
          <div className="mb-5 pb-4 border-b border-zinc-100/80 dark:border-zinc-800/60">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-zinc-900 dark:bg-white shadow-sm">
                <Sparkles className="w-3 h-3 text-white dark:text-zinc-900" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                  {title}
                </h2>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium mt-0.5">
                  Fill in the details below
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Non-section, non-array fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
            {fields.map((field) =>
              field.type !== 'section' && field.type !== 'array'
                ? renderField(field)
                : null
            )}
          </div>

          {/* Sections and arrays */}
          {fields.map((field) =>
            field.type === 'section' || field.type === 'array'
              ? renderField(field)
              : null
          )}

          {/* Footer */}
          <div className="flex justify-end pt-4 border-t border-zinc-100/80 dark:border-zinc-800/60 mt-2">
            <button
              type="submit"
              disabled={loading}
              className="
                relative group/btn
                px-6 py-2.5
                bg-zinc-900 dark:bg-white
                hover:bg-zinc-700 dark:hover:bg-zinc-100
                text-white dark:text-zinc-900
                rounded-xl text-xs font-bold uppercase tracking-wider
                transition-all duration-200
                shadow-[0_2px_8px_rgba(0,0,0,0.2)]
                hover:shadow-[0_4px_16px_rgba(0,0,0,0.25)]
                disabled:opacity-50 disabled:pointer-events-none
                flex items-center gap-2
                cursor-pointer
                overflow-hidden
              "
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500 ease-in-out" />
              {loading && <Loader2 className="w-3 h-3 animate-spin" />}
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ArrayField = ({ field, control, register, errors, renderField }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: field.name,
  });

  return (
    <div className="mt-2 mb-1">
      {/* Section divider */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-700 to-transparent" />
        <span className="text-xs font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] px-2 whitespace-nowrap">
          {field.label}
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-700 to-transparent" />
      </div>

      <div className="flex items-center justify-between mb-3 px-1">
        <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
          {field.required ? 'Entry recommended' : `${fields.length} item${fields.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      <div className="space-y-3">
        {fields.map((item, index) => (
          <div
            key={item.id}
            className="
              relative p-4 rounded-xl
              bg-zinc-50/60 dark:bg-zinc-800/40
              border border-zinc-200/80 dark:border-zinc-700/50
              backdrop-blur-sm
              shadow-[0_2px_8px_rgba(0,0,0,0.04)]
              hover:border-zinc-300 dark:hover:border-zinc-600
              transition-all duration-200
            "
          >
            {/* Item label */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold text-zinc-400 uppercase tracking-widest">
                Entry #{index + 1}
              </span>
              <button
                type="button"
                onClick={() => remove(index)}
                className="
                  p-1.5 rounded-lg
                  text-zinc-400 hover:text-red-500
                  hover:bg-red-50 dark:hover:bg-red-900/20
                  transition-all duration-150 cursor-pointer
                "
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {field.fields.map((f) => renderField(f, `${field.name}.${index}`))}
            </div>
          </div>
        ))}

        {fields.length === 0 && (
          <div className="
            text-center py-8
            border-2 border-dashed border-zinc-200 dark:border-zinc-700/60
            bg-zinc-50/40 dark:bg-zinc-800/20
            rounded-xl
            backdrop-blur-sm
          ">
            <div className="w-8 h-8 mx-auto mb-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <Plus className="w-4 h-4 text-zinc-400" />
            </div>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold">
              No entries yet
            </p>
            <p className="text-xs text-zinc-300 dark:text-zinc-600 font-medium mt-0.5">
              Click 'Add Item' to begin
            </p>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={() => append({})}
            className="
              flex items-center justify-center gap-1.5 w-fit px-3 py-1.5
              text-[10px] font-bold uppercase tracking-wider
              text-white dark:text-zinc-900
              bg-zinc-900 dark:bg-white
              hover:bg-zinc-700 dark:hover:bg-zinc-100
              rounded-lg transition-all duration-200 cursor-pointer
              shadow-[0_2px_8px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.25)]
            "
          >
            <Plus className="w-3 h-3" /> Add {field.label}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DynamicForm;
