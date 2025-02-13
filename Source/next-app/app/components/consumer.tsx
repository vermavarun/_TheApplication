import { useAppSelector } from "@/store/store";


function Consumer() {


    const producerValue = useAppSelector((state) => state.producer.value);


    return <div>
    Consumer
    producerValue: {producerValue}  
    </div>;
}

export default Consumer;