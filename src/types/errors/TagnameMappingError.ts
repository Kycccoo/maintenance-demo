export interface TagnameMappingError {
  id: string;
  tagname: string;
  t2Tagname: string;
  factoryID: string;
  function: string;
  description: string;
  general: string;
}

export const InitTagnameMappingError: TagnameMappingError = {
  id: '',
  tagname: '',
  t2Tagname: '',
  factoryID: '',
  function: '',
  description: '',
  general: ''
};
