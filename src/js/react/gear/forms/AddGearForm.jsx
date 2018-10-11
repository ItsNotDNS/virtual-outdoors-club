import React from "react";
import { Form, Button, TextArea } from "semantic-ui-react";
import { LabeledInput, GearCategoryDropdown } from "../../components";

export default function AddGearForm() {
    return (
        <Form>
            <LabeledInput label="Gear ID" name="gearId" />
            <GearCategoryDropdown name="gearCategoryId" />
            <LabeledInput label="Deposit Amount" name="deposit" />
            <TextArea label="Description" name="description" />
            <Button /* onClick={} */ content="Submit" />
        </Form>
    );
};
