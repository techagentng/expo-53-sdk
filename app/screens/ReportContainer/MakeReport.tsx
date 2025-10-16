import React from 'react';
import BaseReportComponent from './BaseReportComponent';
import { getCategoryById } from '../../config/categoryConfig';

const MakeReport = ({ navigation }: any) => {
  const category = getCategoryById('others');

  if (!category) {
    return null; // Or handle error case
  }

  return (
    <BaseReportComponent
      category={category}
      navigation={navigation}
    />
  );
};

export default MakeReport;
