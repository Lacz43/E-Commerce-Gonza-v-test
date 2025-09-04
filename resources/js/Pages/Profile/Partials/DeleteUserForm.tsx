import { useForm } from '@inertiajs/react';
import { Alert, Button, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { type FormEventHandler, useId, useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }: { className?: string }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);
    const passId = useId();

    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => setConfirmingUserDeletion(true);

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Eliminar cuenta</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Una vez eliminada la cuenta, todos los recursos y datos se borrarán de forma permanente. Descarga antes cualquier información que desees conservar.
                </p>
            </header>
            <Button variant="contained" color="error" onClick={confirmUserDeletion} disabled={processing}>
                Eliminar cuenta
            </Button>
            <Dialog open={confirmingUserDeletion} onClose={closeModal} maxWidth="xs" fullWidth>
                <form onSubmit={deleteUser}>
                    <DialogTitle>¿Eliminar cuenta?</DialogTitle>
                    <DialogContent dividers>
                        <p className="text-sm text-gray-700 mb-4">
                            Esta acción es permanente. Introduce tu contraseña para confirmar.
                        </p>
                        <TextField
                            id={passId}
                            label="Contraseña"
                            type="password"
                            fullWidth
                            size="small"
                            inputRef={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            error={Boolean(errors.password)}
                            helperText={errors.password || ' '}
                            autoFocus
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeModal} variant="outlined">Cancelar</Button>
                        <Button type="submit" color="error" variant="contained" disabled={processing}>
                            Eliminar
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
            <Collapse in={Boolean(errors.password)}>
                {errors.password && (
                    <Alert severity="error" variant="outlined" sx={{ mt: 1, width: 'fit-content' }}>
                        {errors.password}
                    </Alert>
                )}
            </Collapse>
        </section>
    );
}
