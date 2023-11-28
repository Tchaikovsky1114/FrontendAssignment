import {useCallback, useState} from 'react';

export default function useInput(defaultValue: string | number = 15) {
  const [value, setValue] = useState<string | number>(defaultValue);

  const onChange = useCallback((text: string | number) => {
    setValue(text);
  }, []);

  return {
    value,
    onChange,
  };
}
