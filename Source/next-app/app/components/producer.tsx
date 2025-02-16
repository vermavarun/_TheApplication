import { useAppDispatch } from "@/store/store";
import { setProducerSlice } from "@/store/slices/producerSlices";

function Producer() {
    const dispatch = useAppDispatch();

    function disChange(event: React.ChangeEvent<HTMLInputElement>) {
        dispatch(setProducerSlice({value: event.target.value}));
    }

    return <div>
    Producer
    <input spellCheck="true" data-ms-editor="false" onChange={disChange}></input>
    </div>;
}

export default Producer;