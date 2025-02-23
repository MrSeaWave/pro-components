﻿import { useState, useRef } from 'react';
import useSWR from 'swr';

let testId = 0;

export type ProRequestData<T, U = Record<string, any>> = (params: U, props: any) => Promise<T>;

function useFetchData<T, U extends Record<string, any> = Record<string, any>>(props: {
  proFieldKey?: React.Key;
  params?: U;
  request?: ProRequestData<T, U>;
}): [T | undefined] {
  /** Key 是用来缓存请求的，如果不在是有问题 */
  const [cacheKey] = useState(() => {
    if (props.proFieldKey) {
      return props.proFieldKey.toString();
    }
    testId += 1;
    return testId.toString();
  });

  const proFieldKeyRef = useRef(cacheKey);

  const fetchData = async () => {
    const loadData = await props.request?.(props.params as U, props);
    return loadData;
  };

  const { data, error } = useSWR<T | undefined>([proFieldKeyRef.current, props.params], fetchData, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    revalidateOnReconnect: false,
  });

  return [data || error];
}

export default useFetchData;
