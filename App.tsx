
import React, { useState, useRef } from 'react';
import { AppraisalForm } from './types';
import { ChoiceGroup } from './components/ChoiceGroup';

const INITIAL_STATE: AppraisalForm = {
  brand: 'Rolex',
  warrantyDate: '23-Feb-2011',
  modelNumber: '116610LV-0001',
  serialNumber: '4981R131',
  conclusions: {
    overall: '',
    movement: '',
    warranty: '',
    packaging: '',
  },
  conditions: {
    case: '',
    strap: '',
    crystal: '',
    backCrystal: '',
    hands: '',
    crown: '',
    clasp: '',
    dial: '',
  },
  performance: {
    function: '',
    movementStatus: '',
    waterproof: '',
  },
  notes: '',
  photos: [],
};

const App: React.FC = () => {
  const [form, setForm] = useState<AppraisalForm>(INITIAL_STATE);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const updateField = (field: keyof AppraisalForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const updateSubField = (parent: 'conclusions' | 'conditions' | 'performance', field: string, value: string) => {
    setForm(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as any),
        [field]: value
      }
    }));
  };

  const handleBatchUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const readers = Array.from(files).map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (re) => resolve(re.target?.result as string);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then(newPhotos => {
        setForm(prev => ({
          ...prev,
          photos: [...prev.photos, ...newPhotos]
        }));
      });
    }
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    setForm(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSort = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    const _photos = [...form.photos];
    const draggedItemContent = _photos.splice(dragItem.current, 1)[0];
    _photos.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setForm(prev => ({ ...prev, photos: _photos }));
  };

  const isFormValid = (): boolean => {
    const checkGroup = (obj: any) => Object.values(obj).every(val => val !== '');
    return (
      checkGroup(form.conclusions) &&
      checkGroup(form.conditions) &&
      checkGroup(form.performance)
    );
  };

  const handleSubmit = () => {
    if (!isFormValid()) {
      alert('請填寫所有鑑定選項後再提交');
      return;
    }
    console.log('Submitting form:', form);
    alert('提交成功！');
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-32">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between">
        <button className="flex items-center text-primary font-medium hover:opacity-80">
          <span className="material-icons-round text-2xl mr-1">chevron_left</span>
          <span className="text-base">返回</span>
        </button>
        <h1 className="text-lg font-bold text-gray-900 absolute left-1/2 transform -translate-x-1/2">
          錄入鑑定報告
        </h1>
        <div className="w-12"></div>
      </nav>

      <main className="max-w-md mx-auto p-4 space-y-6">
        {/* Photo Section */}
        <section className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold flex items-center">
              <span className="material-icons-round mr-2 text-primary">photo_camera</span>
              手錶照片紀錄
            </h2>
            <span className="text-xs text-gray-500">{form.photos.length} 張照片</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {form.photos.map((photo, index) => (
              <div 
                key={index}
                draggable
                onDragStart={() => (dragItem.current = index)}
                onDragEnter={() => (dragOverItem.current = index)}
                onDragEnd={handleSort}
                onDragOver={(e) => e.preventDefault()}
                className="aspect-square bg-gray-50 rounded-lg relative group cursor-move border border-gray-200 overflow-hidden shadow-sm active:scale-95 transition-transform"
              >
                <img src={photo} className="w-full h-full object-cover" alt={`Watch ${index}`} />
                <button 
                  onClick={() => removePhoto(index)}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="material-icons-round text-sm">close</span>
                </button>
                <div className="absolute bottom-1 left-1 bg-black/30 text-white text-[10px] px-1.5 rounded-md backdrop-blur-sm">
                  {index + 1}
                </div>
              </div>
            ))}
            
            <label className="aspect-square bg-gray-50 rounded-lg flex flex-col items-center justify-center text-primary font-medium border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleBatchUpload} 
                className="hidden" 
              />
              <span className="material-icons-round text-3xl mb-1">add_a_photo</span>
              <span className="text-[10px]">批量上傳</span>
            </label>
          </div>
          <p className="mt-3 text-[10px] text-gray-400 text-center italic">提示：長按圖片可拖動調整排序</p>
        </section>

        {/* Basic Info */}
        <section className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 space-y-4">
          <h2 className="text-base font-bold border-l-4 border-primary pl-3">基本資料</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">品牌</label>
              <div className="relative">
                <select 
                  value={form.brand}
                  onChange={(e) => updateField('brand', e.target.value)}
                  className="block w-full rounded-lg border-gray-300 bg-white text-gray-900 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2 pl-3 pr-8 appearance-none"
                >
                  <option>Rolex</option>
                  <option>Patek Philippe</option>
                  <option>Audemars Piguet</option>
                  <option>Omega</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <span className="material-icons-round text-sm">expand_more</span>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">保卡日期</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={form.warrantyDate}
                  onChange={(e) => updateField('warrantyDate', e.target.value)}
                  className="block w-full rounded-lg border-gray-300 bg-white text-gray-900 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2 pl-3 pr-8"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <span className="material-icons-round text-sm">calendar_today</span>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">型號</label>
              <input 
                type="text" 
                value={form.modelNumber}
                onChange={(e) => updateField('modelNumber', e.target.value)}
                className="block w-full rounded-lg border-gray-300 bg-white text-gray-900 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2 px-3"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">序號</label>
              <input 
                type="text" 
                value={form.serialNumber}
                onChange={(e) => updateField('serialNumber', e.target.value)}
                className="block w-full rounded-lg border-gray-300 bg-white text-gray-900 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2 px-3"
              />
            </div>
          </div>
        </section>

        {/* Conclusions */}
        <section className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 space-y-5">
          <h2 className="text-base font-bold border-l-4 border-primary pl-3">鑑定結論</h2>
          <ChoiceGroup 
            label="整體鑑定結果" 
            options={['符合原廠工藝標準', '不符合原廠工藝標準']} 
            value={form.conclusions.overall} 
            onChange={(v) => updateSubField('conclusions', 'overall', v)}
          />
          <ChoiceGroup 
            label="機芯鑑定結果" 
            options={['符合原廠工藝標準', '不符合原廠工藝標準', '未開蓋檢測']} 
            value={form.conclusions.movement} 
            onChange={(v) => updateSubField('conclusions', 'movement', v)}
          />
          <ChoiceGroup 
            label="保卡鑑定結果" 
            options={['符合原廠工藝標準', '不符合原廠工藝標準', '不適用']} 
            value={form.conclusions.warranty} 
            onChange={(v) => updateSubField('conclusions', 'warranty', v)}
          />
          <ChoiceGroup 
            label="包裝鑑定結果" 
            options={['符合原廠工藝標準', '不符合原廠工藝標準', '不適用']} 
            value={form.conclusions.packaging} 
            onChange={(v) => updateSubField('conclusions', 'packaging', v)}
          />
        </section>

        {/* Conditions */}
        <section className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 space-y-6">
          <h2 className="text-base font-bold border-l-4 border-primary pl-3">手錶狀態</h2>
          <ChoiceGroup 
            label="錶殼" 
            options={['目測無瑕疵', '正常使用痕跡', '明顯使用痕跡', '有打磨痕跡', '非原裝', '不適用']} 
            value={form.conditions.case} 
            onChange={(v) => updateSubField('conditions', 'case', v)}
          />
          <ChoiceGroup 
            label="錶帶" 
            borderTop
            options={['目測無瑕疵', '正常使用痕跡', '明顯使用痕跡', '有打磨痕跡', '非原裝', '不適用']} 
            value={form.conditions.strap} 
            onChange={(v) => updateSubField('conditions', 'strap', v)}
          />
          <ChoiceGroup 
            label="手錶鏡面" 
            borderTop
            options={['目測無瑕疵', '輕微碰崩刮痕', '明顯碰崩刮痕', '有後加塗層痕跡', '非原裝', '不適用']} 
            value={form.conditions.crystal} 
            onChange={(v) => updateSubField('conditions', 'crystal', v)}
          />
          <ChoiceGroup 
            label="錶底鏡面" 
            borderTop
            options={['目測無瑕疵', '輕微碰崩刮痕', '明顯碰崩刮痕', '有後加塗層痕跡', '非原裝', '不適用']} 
            value={form.conditions.backCrystal} 
            onChange={(v) => updateSubField('conditions', 'backCrystal', v)}
          />
          <ChoiceGroup 
            label="指針" 
            borderTop
            options={['目測無瑕疵', '正常使用痕跡', '明顯使用痕跡', '有打磨痕跡', '非原裝', '不適用']} 
            value={form.conditions.hands} 
            onChange={(v) => updateSubField('conditions', 'hands', v)}
          />
          <ChoiceGroup 
            label="錶冠" 
            borderTop
            options={['目測無瑕疵', '正常使用痕跡', '明顯使用痕跡', '有打磨痕跡', '非原裝', '不適用']} 
            value={form.conditions.crown} 
            onChange={(v) => updateSubField('conditions', 'crown', v)}
          />
          <ChoiceGroup 
            label="錶扣" 
            borderTop
            options={['目測無瑕疵', '正常使用痕跡', '明顯使用痕跡', '有打磨痕跡', '非原裝', '不適用']} 
            value={form.conditions.clasp} 
            onChange={(v) => updateSubField('conditions', 'clasp', v)}
          />
          <ChoiceGroup 
            label="錶盤" 
            borderTop
            options={['目測無瑕疵', '正常使用痕跡', '明顯使用痕跡', '有打磨痕跡', '非原裝', '不適用']} 
            value={form.conditions.dial} 
            onChange={(v) => updateSubField('conditions', 'dial', v)}
          />
        </section>

        {/* Performance */}
        <section className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 space-y-5">
          <h2 className="text-base font-bold border-l-4 border-primary pl-3">機芯與性能</h2>
          <ChoiceGroup 
            label="手錶功能" 
            options={['檢測當下運作正常', '部分功能未能正常運作']} 
            value={form.performance.function} 
            onChange={(v) => updateSubField('performance', 'function', v)}
          />
          <ChoiceGroup 
            label="機芯狀態" 
            options={['走時在可接受誤差範圍內', '建議抹油保養', '不適用']} 
            value={form.performance.movementStatus} 
            onChange={(v) => updateSubField('performance', 'movementStatus', v)}
          />
          <ChoiceGroup 
            label="防水功能" 
            options={['通過一般氣密測試', '不通過一般氣密測試', '不適用']} 
            value={form.performance.waterproof} 
            onChange={(v) => updateSubField('performance', 'waterproof', v)}
          />
        </section>

        {/* Notes */}
        <section className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 space-y-4">
          <h2 className="text-base font-bold border-l-4 border-primary pl-3">鑑定附註</h2>
          <textarea 
            value={form.notes}
            onChange={(e) => updateField('notes', e.target.value)}
            className="block w-full rounded-lg border-gray-300 bg-white text-gray-900 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3 resize-none" 
            placeholder="請輸入補充描述..." 
            rows={4}
          />
          <div className="overflow-x-auto no-scrollbar">
            <div className="flex space-x-2 pb-2">
              {['極佳品品相', '正常使用歲月痕跡', '建議保養', '代用錶帶', '無盒單'].map(tag => (
                <button 
                  key={tag}
                  onClick={() => updateField('notes', form.notes + (form.notes ? ' ' : '') + tag)}
                  className="whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-8 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="max-w-md mx-auto flex space-x-3">
          <button className="flex-1 bg-white text-gray-600 font-medium py-3 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors">
            保存
          </button>
          <button 
            onClick={handleSubmit}
            className={`flex-[2] text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all ${
              isFormValid() 
                ? 'bg-primary hover:bg-opacity-90 active:scale-[0.98]' 
                : 'bg-gray-300 cursor-not-allowed opacity-80'
            }`}
          >
            提交鑑定結果
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
