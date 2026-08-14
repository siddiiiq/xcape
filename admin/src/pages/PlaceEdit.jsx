import React from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../components/layout/PageHeader.jsx";
import PlaceForm from "../components/forms/PlaceForm.jsx";
import Loader from "../components/common/Loader.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import { useFetch } from "../hooks/useFetch.js";
import { getPlace } from "../api/placesApi.js";

const PlaceEdit = () => {
  const { id } = useParams();
  const { data, loading, error, refetch } = useFetch(() => getPlace(id), [id]);

  return (
    <div>
      <PageHeader title="Edit Place" description={data?.place?.title} />
      {loading && <Loader label="Loading place..." />}
      {error && <ErrorState message={error} onRetry={refetch} />}
      {data?.place && <PlaceForm existingPlace={data.place} placeId={id} />}
    </div>
  );
};

export default PlaceEdit;
