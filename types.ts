
export interface AppraisalForm {
  brand: string;
  warrantyDate: string;
  modelNumber: string;
  serialNumber: string;
  conclusions: {
    overall: string;
    movement: string;
    warranty: string;
    packaging: string;
  };
  conditions: {
    case: string;
    strap: string;
    crystal: string;
    backCrystal: string;
    hands: string;
    crown: string;
    clasp: string;
    dial: string;
  };
  performance: {
    function: string;
    movementStatus: string;
    waterproof: string;
  };
  notes: string;
  photos: string[]; // Changed from object to array of base64 strings
}

export type FormSection = 'conclusions' | 'conditions' | 'performance';
