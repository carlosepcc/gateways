import { Dialog } from "quasar";

export function confirm(
  functionToExecuteOnConfirmation,
  functionToExecuteOnCancel,
  message = "¿Está seguro?",
  title = "Confirme",
  color = "negative"
) {
  Dialog.create({
    title,
    message,
    color,
    ok: { noCaps: true, flat: true },
    cancel: { color: "info", noCaps: true, flat: true },
  })
    .onOk(() => functionToExecuteOnConfirmation())
    .onCancel(() => functionToExecuteOnCancel());
}
