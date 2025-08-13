import requests
import logging
from flask import current_app
from datetime import datetime
import json

# 设置日志
logger = logging.getLogger(__name__)

class HubSpotCRM:
    """HubSpot CRM集成类"""
    
    def __init__(self):
        self.access_token = current_app.config.get('HUBSPOT_ACCESS_TOKEN')
        self.portal_id = current_app.config.get('HUBSPOT_PORTAL_ID')
        self.base_url = 'https://api.hubapi.com'
        
    def _make_request(self, method, endpoint, data=None):
        """发送API请求"""
        if not self.access_token:
            logger.warning("HubSpot access token not configured")
            return None
            
        headers = {
            'Authorization': f'Bearer {self.access_token}',
            'Content-Type': 'application/json'
        }
        
        url = f"{self.base_url}{endpoint}"
        
        try:
            if method.upper() == 'GET':
                response = requests.get(url, headers=headers, params=data)
            elif method.upper() == 'POST':
                response = requests.post(url, headers=headers, json=data)
            elif method.upper() == 'PUT':
                response = requests.put(url, headers=headers, json=data)
            elif method.upper() == 'PATCH':
                response = requests.patch(url, headers=headers, json=data)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
            
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.RequestException as e:
            logger.error(f"HubSpot API request failed: {e}")
            return None
    
    def create_contact(self, lead):
        """在HubSpot中创建联系人"""
        try:
            # 准备联系人数据
            properties = {
                'email': lead.email,
                'firstname': lead.first_name,
                'lastname': lead.last_name,
                'phone': lead.phone,
                'company': lead.company,
                'jobtitle': lead.job_title,
                'website': lead.website,
                'city': lead.location,
                'industry': lead.industry,
                'hs_lead_status': 'NEW',
                'lifecyclestage': 'lead',
                'lead_source': lead.source,
                'lead_score': str(lead.lead_score),
                'company_size': lead.company_size,
                'project_timeline': lead.project_timeline,
                'budget_range': lead.budget_range,
                'application_area': lead.application_area,
                'requirements': lead.requirements,
                'challenges': lead.challenges,
                'utm_source': lead.utm_source,
                'utm_medium': lead.utm_medium,
                'utm_campaign': lead.utm_campaign
            }
            
            # 移除空值
            properties = {k: v for k, v in properties.items() if v is not None}
            
            data = {'properties': properties}
            
            # 发送请求
            result = self._make_request('POST', '/crm/v3/objects/contacts', data)
            
            if result:
                logger.info(f"Contact created in HubSpot: {lead.email}")
                return result.get('id')
            
        except Exception as e:
            logger.error(f"Failed to create HubSpot contact: {e}")
            
        return None
    
    def update_contact(self, hubspot_id, lead):
        """更新HubSpot联系人"""
        try:
            properties = {
                'firstname': lead.first_name,
                'lastname': lead.last_name,
                'phone': lead.phone,
                'company': lead.company,
                'jobtitle': lead.job_title,
                'lead_score': str(lead.lead_score),
                'hs_lead_status': lead.status.upper(),
                'lastmodifieddate': datetime.utcnow().isoformat()
            }
            
            # 移除空值
            properties = {k: v for k, v in properties.items() if v is not None}
            
            data = {'properties': properties}
            
            result = self._make_request('PATCH', f'/crm/v3/objects/contacts/{hubspot_id}', data)
            
            if result:
                logger.info(f"Contact updated in HubSpot: {lead.email}")
                return True
                
        except Exception as e:
            logger.error(f"Failed to update HubSpot contact: {e}")
            
        return False
    
    def create_deal(self, lead, demo_request=None):
        """在HubSpot中创建交易"""
        try:
            # 准备交易数据
            deal_name = f"{lead.company} - {lead.application_area or 'Robotics Solution'}"
            
            properties = {
                'dealname': deal_name,
                'dealstage': 'appointmentscheduled' if demo_request else 'qualifiedtobuy',
                'pipeline': 'default',
                'amount': self._estimate_deal_value(lead),
                'closedate': self._estimate_close_date(lead),
                'deal_source': lead.source,
                'lead_score': str(lead.lead_score),
                'industry': lead.industry,
                'company_size': lead.company_size,
                'budget_range': lead.budget_range,
                'project_timeline': lead.project_timeline
            }
            
            # 移除空值
            properties = {k: v for k, v in properties.items() if v is not None}
            
            data = {'properties': properties}
            
            result = self._make_request('POST', '/crm/v3/objects/deals', data)
            
            if result:
                logger.info(f"Deal created in HubSpot: {deal_name}")
                return result.get('id')
                
        except Exception as e:
            logger.error(f"Failed to create HubSpot deal: {e}")
            
        return None
    
    def _estimate_deal_value(self, lead):
        """估算交易价值"""
        budget_mapping = {
            'under_100k': 50000,
            '100k_500k': 300000,
            '500k_1m': 750000,
            'over_1m': 1500000
        }
        
        return budget_mapping.get(lead.budget_range, 100000)
    
    def _estimate_close_date(self, lead):
        """估算成交日期"""
        from datetime import timedelta
        
        timeline_mapping = {
            'immediate': 30,
            'short_term': 90,
            'long_term': 180
        }
        
        days = timeline_mapping.get(lead.project_timeline, 90)
        close_date = datetime.utcnow() + timedelta(days=days)
        
        return close_date.strftime('%Y-%m-%d')

class SalesforceCRM:
    """Salesforce CRM集成类"""
    
    def __init__(self):
        self.username = current_app.config.get('SALESFORCE_USERNAME')
        self.password = current_app.config.get('SALESFORCE_PASSWORD')
        self.security_token = current_app.config.get('SALESFORCE_SECURITY_TOKEN')
        self.domain = current_app.config.get('SALESFORCE_DOMAIN', 'login')
        self.session_id = None
        self.instance_url = None
    
    def authenticate(self):
        """Salesforce身份验证"""
        if not all([self.username, self.password, self.security_token]):
            logger.warning("Salesforce credentials not configured")
            return False
            
        soap_body = f"""<?xml version="1.0" encoding="utf-8"?>
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:enterprise.soap.sforce.com">
            <soapenv:Header/>
            <soapenv:Body>
                <urn:login>
                    <urn:username>{self.username}</urn:username>
                    <urn:password>{self.password}{self.security_token}</urn:password>
                </urn:login>
            </soapenv:Body>
        </soapenv:Envelope>"""
        
        headers = {
            'Content-Type': 'text/xml; charset=UTF-8',
            'SOAPAction': 'login'
        }
        
        try:
            response = requests.post(
                f'https://{self.domain}.salesforce.com/services/Soap/c/58.0',
                data=soap_body,
                headers=headers
            )
            
            if response.status_code == 200:
                # 解析响应获取session_id和instance_url
                # 这里简化处理，实际应该使用XML解析
                content = response.text
                if 'sessionId' in content:
                    logger.info("Salesforce authentication successful")
                    return True
                    
        except Exception as e:
            logger.error(f"Salesforce authentication failed: {e}")
            
        return False
    
    def create_lead(self, lead):
        """在Salesforce中创建线索"""
        if not self.authenticate():
            return None
            
        # 这里应该实现Salesforce REST API调用
        # 由于需要复杂的OAuth流程，这里提供框架
        logger.info(f"Would create Salesforce lead for {lead.email}")
        return None

def sync_lead_to_crm(lead):
    """同步线索到CRM系统"""
    try:
        # 优先使用HubSpot
        if current_app.config.get('HUBSPOT_ACCESS_TOKEN'):
            hubspot = HubSpotCRM()
            contact_id = hubspot.create_contact(lead)
            
            if contact_id:
                # 如果有演示请求，创建交易
                if lead.demo_requests:
                    hubspot.create_deal(lead, lead.demo_requests[0])
                
                logger.info(f"Lead synced to HubSpot: {lead.email}")
                return True
        
        # 备选Salesforce
        elif current_app.config.get('SALESFORCE_USERNAME'):
            salesforce = SalesforceCRM()
            lead_id = salesforce.create_lead(lead)
            
            if lead_id:
                logger.info(f"Lead synced to Salesforce: {lead.email}")
                return True
        
        else:
            logger.warning("No CRM system configured")
            
    except Exception as e:
        logger.error(f"Failed to sync lead to CRM: {e}")
        
    return False

def update_lead_in_crm(lead, crm_id=None):
    """更新CRM中的线索信息"""
    try:
        if current_app.config.get('HUBSPOT_ACCESS_TOKEN') and crm_id:
            hubspot = HubSpotCRM()
            return hubspot.update_contact(crm_id, lead)
            
    except Exception as e:
        logger.error(f"Failed to update lead in CRM: {e}")
        
    return False

def create_crm_activity(lead, activity_type, description):
    """在CRM中创建活动记录"""
    try:
        if current_app.config.get('HUBSPOT_ACCESS_TOKEN'):
            hubspot = HubSpotCRM()
            
            # 创建活动记录的API调用
            activity_data = {
                'properties': {
                    'hs_activity_type': activity_type,
                    'hs_activity_subject': description,
                    'hs_activity_date': datetime.utcnow().isoformat(),
                    'hubspot_owner_id': '1'  # 默认所有者
                }
            }
            
            result = hubspot._make_request('POST', '/crm/v3/objects/activities', activity_data)
            
            if result:
                logger.info(f"Activity created in CRM: {activity_type}")
                return True
                
    except Exception as e:
        logger.error(f"Failed to create CRM activity: {e}")
        
    return False

def get_crm_analytics():
    """获取CRM分析数据"""
    try:
        if current_app.config.get('HUBSPOT_ACCESS_TOKEN'):
            hubspot = HubSpotCRM()
            
            # 获取联系人统计
            contacts_result = hubspot._make_request('GET', '/crm/v3/objects/contacts', {
                'limit': 1,
                'properties': 'email'
            })
            
            if contacts_result:
                total_contacts = contacts_result.get('total', 0)
                
                return {
                    'total_contacts': total_contacts,
                    'crm_system': 'HubSpot',
                    'last_sync': datetime.utcnow().isoformat()
                }
                
    except Exception as e:
        logger.error(f"Failed to get CRM analytics: {e}")
        
    return {
        'total_contacts': 0,
        'crm_system': 'None',
        'last_sync': None
    }

