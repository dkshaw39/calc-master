import React from 'react';

export enum CalculatorType {
  STANDARD = 'STANDARD',
  MORTGAGE = 'MORTGAGE',
  BMI = 'BMI'
}

export interface NavItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

export interface CalculatorLink {
  label: string;
  path: string;
}

export interface CalculatorCategory {
  title: string;
  icon: any;
  items: CalculatorLink[];
}