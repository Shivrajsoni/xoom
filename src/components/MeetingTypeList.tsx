"use client";

import React, { useState } from 'react'
import HomeCard from './HomeCard';
import { useRouter } from 'next/navigation';
import MeetingModal from './MeetingModal';
import { useUser } from '@clerk/nextjs';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { toast } from "sonner"
import { Textarea } from './ui/textarea';
import DatePicker from "react-datepicker";
import Loader from './Loader';
import { Input } from './ui/input';

const initalValue = {
  dateTime:new Date(),
  description:'',
  link:'',
}

const MeetingTypeList = () => {
    const [meetingState,setMeetingState] = useState<'isInstantMeeting'| 'isJoiningMeeting' | 'isScheduleMeeting' | undefined>();
    const router = useRouter();
    const {user} = useUser();
    const client = useStreamVideoClient();
    
    const [values,setValues] = useState(initalValue);
    const [callDetails,setCallDetails] = useState<Call>();
    
    const createMeeting = async() =>{
      if(!user || !client) return ;
      
      try {
        if (!values.dateTime) {
          toast('Please select a date and time');
          return;
        }
        const id = crypto.randomUUID();
        const call = client.call('default',id);
        if (!call) throw new Error('Failed to create meeting');
        const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
        const description = values.description || 'Instant Meeting';
        
        await call.getOrCreate({
          data:{
            starts_at:startsAt,
            custom:{
              description,
            },
          }
        });

        setCallDetails(call);
        if(!values.description){
          router.push(`/meeting/${call.id}`);
          toast('Meeting Created');
        }
      
      } catch (error) {
        console.log(error);
        toast('Failed to Create Meeting');
      }

    }
    
    if (!client || !user) return <Loader />;
    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;

   return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <HomeCard
         img="/icons/add-meeting.svg"
         title="New Meeting"
         description="Start an instant meeting"
         className='bg-green-300'
         handleClick={() => setMeetingState('isInstantMeeting')}
        />

        <HomeCard
        img="/icons/join-meeting.svg"
        title="Join Meeting"
        description="via invitation link"
        className="bg-blue-400"
        handleClick={() => setMeetingState('isJoiningMeeting')}/>
        
        <HomeCard
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan your meeting"
        className="bg-purple-400"
        handleClick={() => setMeetingState('isScheduleMeeting')}
        />
        <HomeCard
        img="/icons/recordings.svg"
        title="View Recordings"
        description="Meeting Recordings"
        className="bg-yellow-500"
        handleClick={() => router.push('/recordings')}
        />
        {!callDetails? (
          <MeetingModal
          isOpen = {meetingState==='isScheduleMeeting'}
          onClose = {()=>setMeetingState(undefined)}
          title = 'Create A Meeting'
          className = 'text-center'
          buttonText = 'Schedule Meeting'
          handleClick = {createMeeting}
          >
            <div className='flex flex-col gap-2.5'>
              <label className='text-base font-normal leading-[22.4px] text-sky-200'>
                Add a Description 
              </label>
              <Textarea
              className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            />
            </div>
            <div className='flex w-full flex-col gap-2.5'>
              <label className='text-base font-normal leading-[22.4px] text-sky-200'>
                Select Date And Time 
              </label>
              <DatePicker
              selected={values.dateTime}
              onChange={(date)=> setValues({...values,dateTime:date!})}
              showTimeSelect
              timeFormat='HH:mm'
              timeIntervals={15}
              timeCaption='time'
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full rounded bg-dark-3 p-2 focus:outline-none"
              />
            </div>

          </MeetingModal>
        ):(
          <MeetingModal
          isOpen = {meetingState==='isScheduleMeeting'}
          onClose = {()=>setMeetingState(undefined)}
          title = 'Start an Instance Meeting'
          className = 'text-center'
          handleClick = {()=>{
            navigator.clipboard.writeText(meetingLink);
            toast('Link Copied');
          }}
          image="/icons/checked.svg"
          buttonIcon="/icons/copy.svg"
          buttonText="Copy Meeting Link"
          />
        )
        }
        <MeetingModal
        isOpen = {meetingState==='isInstantMeeting'}
        onClose = {()=>setMeetingState(undefined)}
        title = 'Start an Instance Meeting'
        className = 'text-center'
        buttonText = 'Start Meeting'
        handleClick = {createMeeting}
        />
        <MeetingModal
        isOpen = {meetingState==='isJoiningMeeting'}
        onClose = {()=>setMeetingState(undefined)}
        title = 'Type The Link Here'
        className = 'text-center'
        buttonText = 'Join Meeting'
        handleClick = {()=>{router.push(values.link)}}
        >
          <Input
          placeholder="Meeting link"
          onChange={(e) => setValues({ ...values, link: e.target.value })}
          className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </MeetingModal>
    </section>
  )
}

export default MeetingTypeList
