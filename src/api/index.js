import httpClient from '@/utils/request'

export async function login(data){
    return await httpClient({
        method: 'post',
        url: '/login',
        data
    })
}

export async function getJobs(data){
    return await httpClient({
        method: 'get',
        url: '/quartz/jobs',
        params: data
    })
}

export async function TriggerJob(data){
    return await httpClient({
        method: 'post',
        url: '/quartz/triggerJob',
        data
    })
}

export async function getTriggers(data){
    return await httpClient({
        method: 'get',
        url: '/quartz/triggers',
        params: data
    })
}

export async function TriggerAction(data){
    return await httpClient({
        method: 'post',
        url: '/quartz/triggerAction',
        data
    })
}

export async function getUsers(){
    return await httpClient({
        method: 'get',
        url: '/users',
    })
}