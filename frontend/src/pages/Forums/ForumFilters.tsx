import { Dispatch, FC, useEffect, useState } from "react";

import PrimaryButton from "../../ui/PrimaryButton";
import { getAllCarsWithModels } from "../../services/carService";

interface FilterAction {
  type: string;
  payload?: string | number;
}

interface ForumFiltersProps {
  carBrand: string;
  carModel: string;
  title: string;
  dispatch: Dispatch<FilterAction>;
}

type CarsData = {
  [brand: string]: string[];
};

const ForumFilters: FC<ForumFiltersProps> = ({
  carBrand,
  carModel,
  title,
  dispatch,
}) => {
  const [cars, setCars] = useState<CarsData>({});
  const [typedTitle, setTypedTitle] = useState(title);

  const getCars = async () => {
    try {
      const response = await getAllCarsWithModels();
      console.log(response.cars);
      setCars(response.cars);
    } catch (error) {
      console.log(error);
    }
  };

  const setCarBrand = (brand: string) => {
    dispatch({ type: "SET_CAR_BRAND", payload: brand });
  };

  const setCarModel = (model: string) => {
    dispatch({ type: "SET_CAR_MODEL", payload: model });
  };

  const clearFilters = () => {
    dispatch({ type: "CLEAR_FILTERS" });
    setTypedTitle("");
  };

  const setTitle = (title: string) => {
    dispatch({ type: "SET_TITLE", payload: title });
  };

  const onSubmitTitleForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTitle(typedTitle);
    console.log(title);
  };

  useEffect(() => {
    getCars();
  }, []);

  return (
    <div className="flex gap-4 items-center">
      <form onSubmit={onSubmitTitleForm}>
        <input
          value={typedTitle}
          onChange={(e) => {
            setTypedTitle(e.target.value);
          }}
          type="text"
          placeholder="Szukaj po nazwie"
          className="p-2 rounded-md focus:ring-2 ring-blue-600 bg-white dark:bg-grayDark outline-none w-72"
        />
      </form>
      <form className="flex gap-4">
        <select
          className="p-2 rounded-md cursor-pointer focus:ring-2 ring-blue-600 bg-white dark:bg-grayDark w-36"
          value={carBrand}
          onChange={(e) => setCarBrand(e.target.value)}
        >
          <option value={""}>Marka</option>
          {Object.keys(cars).map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
        <select
          className="p-2 rounded-md cursor-pointer focus:ring-2 ring-blue-600 bg-white dark:bg-grayDark w-36"
          disabled={!carBrand}
          value={carModel}
          onChange={(e) => setCarModel(e.target.value)}
        >
          <option value={""}>Model</option>
          {carBrand &&
            cars[carBrand].map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
        </select>
      </form>
      <PrimaryButton size="md" onClick={clearFilters}>
        Wyczyść filtry
      </PrimaryButton>
    </div>
  );
};

export default ForumFilters;
