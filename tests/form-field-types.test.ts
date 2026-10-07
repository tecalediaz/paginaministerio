import test from "node:test";
import assert from "node:assert/strict";
import { parseTramiteFormFields, validateTramiteForm } from "../lib/tramite-form";

test("numbers reject letters, decimal and exponent notation", () => {
  const fields = parseTramiteFormFields([{ id: "n", name: "cantidad", label: "Cantidad", type: "number", required: true }]);
  assert.equal(fields.length, 1);
  for (const value of ["12a", "1e3", "1.2", "-1", ""]) {
    const data = new FormData(); data.set("cantidad", value);
    assert.equal(validateTramiteForm(data, fields).ok, false);
  }
  const data = new FormData(); data.set("cantidad", "123");
  assert.equal(validateTramiteForm(data, fields).ok, true);
});

test("multiple choices accept only known unique values and use option order", () => {
  const fields = parseTramiteFormFields([{ id: "m", name: "dias", label: "Días", type: "checkbox", required: true, options: [{value:"a",label:"Lunes"},{value:"b",label:"Martes"}] }]);
  assert.equal(fields.length, 1);
  const data = new FormData(); data.append("dias", "b"); data.append("dias", "a");
  assert.deepEqual(validateTramiteForm(data, fields), {ok:true,errors:{},answers:{dias:'["a","b"]'}});
  data.append("dias", "a"); assert.equal(validateTramiteForm(data, fields).ok, false);
  data.set("dias", "unknown"); assert.equal(validateTramiteForm(data, fields).ok, false);
  data.delete("dias"); assert.equal(validateTramiteForm(data, fields).ok, false);
});

test("single choices reject multiple submitted values", () => {
  const fields = parseTramiteFormFields([{ id:"r",name:"opcion",label:"Opción",type:"radio",required:true,options:[{value:"a",label:"A"}] }]);
  assert.equal(fields.length, 1);
  const data = new FormData(); data.set("opcion", "a"); assert.equal(validateTramiteForm(data, fields).ok,true);
  data.append("opcion", "a"); assert.equal(validateTramiteForm(data, fields).ok,false);
});
