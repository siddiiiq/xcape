import React from "react";
import PageHeader from "../components/layout/PageHeader.jsx";
import PlaceForm from "../components/forms/PlaceForm.jsx";

const PlaceCreate = () => (
  <div>
    <PageHeader title="New Place" description="Add a destination the crew got lost in." />
    <PlaceForm />
  </div>
);

export default PlaceCreate;
