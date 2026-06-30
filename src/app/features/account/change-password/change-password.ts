import { Component, inject, signal } from '@angular/core';
import { ChangePasswordDTO } from '../account.model.dto';
import { form, FormField, FormRoot, required, validateTree } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { ApiResponse } from '../../../core/model/api-response.model';
import { NotificationService } from '../../../core/services/notification.service';
import { urlAccount } from '../../../core/services/endpoint.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNg } from '../../../shared/custom/input-ng/input-ng';
import { Button } from "primeng/button";

@Component({
  selector: 'app-change-password',
  imports: [FormField, FormRoot, InputNg, Button],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css',
})
export class ChangePassword {
  private api = inject(ApiService);
  private nt = inject(NotificationService);
  private ref = inject(DynamicDialogRef);

  private model = signal<ChangePasswordDTO>({
    current: '',
    newPass: '',
    confirmPass: '',
  });

  form = form(
    this.model,
    (schemaPath) => {
      required(schemaPath.current, { message: 'Debe indicar la contraseña actual' });
      required(schemaPath.newPass, { message: 'Ingrese la nueva contraseña' });
      required(schemaPath.confirmPass, { message: 'Confirme la contraseña' });
      validateTree(schemaPath, (ctx) => {
        const newPass = ctx.valueOf(schemaPath.newPass);
        const confirm = ctx.valueOf(schemaPath.confirmPass);
        if (newPass && confirm && newPass !== confirm) {
          return {
            fieldTree: ctx.fieldTreeOf(schemaPath.confirmPass),
            kind: 'password-mismatch',
            message: 'Las contraseñas no coinciden',
          };
        }
        return undefined;
      });
    },
    {
      submission: {
        action: async (raw) => {          
          const result = await firstValueFrom(
            this.api.post<ApiResponse<any>>(`${urlAccount}/changepass`, {
              password: raw().value().current,
              newPassword: raw().value().newPass,
            }),
          );
          this.nt.showSuccess('Éxito', 'La contraseña se actualizó correctamente');
          this.ref?.close();
          return;
        },
      },
    },
  );

  formClose(){
    this.ref?.close();
  }
}
