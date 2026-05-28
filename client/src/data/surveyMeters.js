/** @typedef {'Working' | 'Not Working'} SurveyMeterStatus */

/**
 * @typedef {Object} SurveyMeter
 * @property {string} id
 * @property {string} surveyMeterName
 * @property {string} supplier
 * @property {string} dateOfProcurement
 * @property {string} make
 * @property {string} model
 * @property {string} serialNumber
 * @property {string} detectorType
 * @property {string} detectorVolume
 * @property {string} radiationType
 * @property {SurveyMeterStatus} functionalStatus
 * @property {string} calibrationDate
 * @property {string} calibrationTillDate
 * @property {string} calibrationLab
 */

export const SURVEY_METER_STATUSES = ['Working', 'Not Working']

export const SURVEY_METERS = [
  {
    id: 'SM-1001',
    surveyMeterName: 'Gamma Survey Meter - Unit 1',
    supplier: 'Nucleonix Systems',
    dateOfProcurement: '2023-07-18',
    make: 'Nucleonix',
    model: 'RM-900',
    serialNumber: 'NX-RM900-5531',
    detectorType: 'GM Tube',
    detectorVolume: '1.5 cc',
    radiationType: 'Gamma',
    functionalStatus: 'Working',
    calibrationDate: '2025-06-14',
    calibrationTillDate: '2026-06-13',
    calibrationLab: 'Bhabha Calibration Lab',
  },
  {
    id: 'SM-1002',
    surveyMeterName: 'Area Monitor - Coke Oven',
    supplier: 'Ludlum India',
    dateOfProcurement: '2022-04-09',
    make: 'Ludlum',
    model: 'Model 3',
    serialNumber: 'LD-M3-7712',
    detectorType: 'Scintillation',
    detectorVolume: '2.0 inch',
    radiationType: 'Gamma',
    functionalStatus: 'Working',
    calibrationDate: '2025-04-22',
    calibrationTillDate: '2026-04-21',
    calibrationLab: 'AERB Approved Lab - Mumbai',
  },
  {
    id: 'SM-1003',
    surveyMeterName: 'Portable Contamination Meter',
    supplier: 'RAMON Science & Tech',
    dateOfProcurement: '2021-12-16',
    make: 'RAMON',
    model: 'RCM-21',
    serialNumber: 'RM-RCM21-0907',
    detectorType: 'Proportional',
    detectorVolume: '50 cm2',
    radiationType: 'Beta/Gamma',
    functionalStatus: 'Not Working',
    calibrationDate: '2024-11-05',
    calibrationTillDate: '2025-11-04',
    calibrationLab: 'Central Instrumentation Lab',
  },
  {
    id: 'SM-1004',
    surveyMeterName: 'Neutron Survey Meter',
    supplier: 'Thermo Fisher',
    dateOfProcurement: '2024-02-11',
    make: 'Thermo',
    model: 'RadEye N',
    serialNumber: 'TH-RADN-2248',
    detectorType: 'He-3 Tube',
    detectorVolume: '8 inch',
    radiationType: 'Neutron',
    functionalStatus: 'Working',
    calibrationDate: '2025-08-01',
    calibrationTillDate: '2026-07-31',
    calibrationLab: 'National Calibration Centre',
  },
]
