export type LabTestType = 'blood' | 'dutch' | 'urine';
export type MarkerStatus = 'below_range' | 'above_range' | 'low_normal' | 'high_normal' | 'normal';

export interface LabResult {
  id: string;
  user_id: string;
  test_type: LabTestType;
  test_date: string | null;
  raw_pdf_url: string | null;
  extracted_markers: ExtractedMarker[] | null;
  cycle_day_drawn: number | null;
  phase_drawn: string | null;
  flagged_markers: FlaggedMarker[] | null;
  ai_interpretation: string | null;
  created_at: string;
}

export interface ExtractedMarker {
  name: string;
  value: number | string;
  unit: string;
  reference_range: string;
  status: MarkerStatus;
}

export interface FlaggedMarker extends ExtractedMarker {
  clinical_significance: 'significant' | 'borderline';
  symptoms_affected: string[];
}
